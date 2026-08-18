<?php

namespace App\Services;

use App\Mail\GenericNotificationMail;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use App\Models\User;
use App\Models\WebSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Parse template by replacing placeholders with actual data
     */
    public static function parse(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $template = str_replace('{{'.$key.'}}', $value, $template);
        }

        return $template;
    }

    /**
     * Send notification to a user using a specific template code
     */
    public static function send(string $templateCode, User $user, array $data = []): void
    {
        try {
            $template = NotificationTemplate::where('code', $templateCode)
                ->where('is_active', true)
                ->first();

            if (! $template) {
                return; // Template doesn't exist or is not active
            }

            $settings = WebSetting::first();

            $emailSent = false;
            $whatsappSent = false;
            $emailResponse = null;
            $whatsappResponse = null;

            // Handle Email
            if ($template->email_enabled && ! empty($user->email)) {
                $emailSubject = self::parse($template->email_subject ?? '', $data);
                $emailContent = self::parse($template->email_content ?? '', $data);

                try {
                    // Override mail config dynamically if SMTP settings are provided
                    if ($settings && ! empty($settings->smtp_username) && ! empty($settings->smtp_password)) {
                        config([
                            'mail.mailers.smtp.host' => 'smtp.gmail.com',
                            'mail.mailers.smtp.port' => 465, // SSL
                            'mail.mailers.smtp.encryption' => 'ssl',
                            'mail.mailers.smtp.username' => $settings->smtp_username,
                            'mail.mailers.smtp.password' => $settings->smtp_password,
                            'mail.from.address' => $settings->smtp_username,
                            'mail.from.name' => $settings->site_name ?? 'Kost CozQta',
                        ]);
                    }

                    Mail::to($user->email)->send(new GenericNotificationMail($emailSubject, $emailContent));
                    $emailSent = true;
                    $emailResponse = 'Email queued/sent successfully';
                } catch (\Exception $e) {
                    $emailResponse = 'Email error: '.$e->getMessage();
                    Log::error('Failed sending email notification: '.$e->getMessage());
                }
            }

            // Handle WhatsApp
            if ($template->whatsapp_enabled && ! empty($user->phone) && $settings && ! empty($settings->whatsapp_api_url) && ! empty($settings->whatsapp_api_key)) {
                $whatsappContent = self::parse($template->whatsapp_content ?? '', $data);

                try {
                    $response = Http::withHeaders([
                        'Authorization' => $settings->whatsapp_api_key,
                    ])->post($settings->whatsapp_api_url, [
                        'target' => $user->phone,
                        'message' => $whatsappContent,
                    ]);

                    if ($response->successful()) {
                        $whatsappSent = true;
                        $whatsappResponse = 'WA sent: '.$response->body();
                    } else {
                        $whatsappResponse = 'WA failed: '.$response->body();
                        Log::error('Failed sending WA notification: '.$response->body());
                    }
                } catch (\Exception $e) {
                    $whatsappResponse = 'WA error: '.$e->getMessage();
                    Log::error('Error sending WA notification: '.$e->getMessage());
                }
            }

            // Log the notification attempt
            if ($emailSent || $whatsappSent || $emailResponse || $whatsappResponse) {
                NotificationLog::create([
                    'notification_template_id' => $template->id,
                    'user_id' => $user->id,
                    'type' => $emailSent && $whatsappSent ? 'Both' : ($emailSent ? 'Email' : ($whatsappSent ? 'WhatsApp' : 'Failed')),
                    'subject' => $template->email_subject ?? $template->whatsapp_subject ?? $template->name,
                    'content' => json_encode([
                        'email' => $emailResponse,
                        'whatsapp' => $whatsappResponse,
                    ]),
                    'status' => ($emailSent || $whatsappSent) ? 'Sent' : 'Failed',
                    'sent_at' => now(),
                ]);
            }

        } catch (\Exception $e) {
            Log::error('NotificationService Error: '.$e->getMessage());
        }
    }
}

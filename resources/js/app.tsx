import React, { Component, ReactNode } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const appName = import.meta.env.VITE_APP_NAME || 'CozQta';

class GlobalErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null, info: any}> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, info: any) {
        this.setState({ info });
        console.error("ErrorBoundary caught an error", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fef2f2', color: '#991b1b', fontFamily: 'sans-serif', margin: '20px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '10px' }}>⚠️ Terjadi Kesalahan pada Tampilan (UI Crashed)</h2>
                    <p style={{ marginBottom: '15px' }}>Tolong screenshot pesan error di bawah ini dan berikan ke developer:</p>
                    <details style={{ whiteSpace: 'pre-wrap', backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '0.875rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Lihat Detail Error</summary>
                        <div style={{ marginTop: '10px', color: '#b91c1c' }}>
                            {this.state.error && this.state.error.toString()}
                            <br /><br />
                            {this.state.info?.componentStack}
                        </div>
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}


createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    strictMode: true,
    withApp(app) {
        return (
            <GlobalErrorBoundary>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </GlobalErrorBoundary>
        );
    },
    progress: {
        color: '#4F46E5',
    },
});

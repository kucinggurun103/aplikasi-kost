<?php

test('public kosthub routes can be rendered', function () {
    $this->get(route('home'))->assertOk();
    $this->get(route('rooms.index'))->assertOk();
    $this->get(route('rooms.show', ['id' => 1]))->assertOk();
    $this->get(route('bookings.create', ['room_id' => 1]))->assertOk();
    $this->get(route('payments.show', ['booking_id' => 'TRX-123']))->assertOk();
});

test('demo login automatically logs in admin and redirects to admin dashboard', function () {
    $response = $this->get(route('demo.admin'));
    $response->assertRedirect('/dashboard?view=admin');
    $this->assertAuthenticated();
});

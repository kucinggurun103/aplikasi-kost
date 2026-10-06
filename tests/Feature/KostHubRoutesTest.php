<?php

test('public kosthub routes can be rendered', function () {
    $this->get(route('home'))->assertOk();
    $this->get(route('rooms.index'))->assertOk();
    $this->get(route('rooms.show', ['id' => 1]))->assertNotFound();
    $this->get(route('bookings.create', ['room_id' => 1]))->assertOk();
    $this->get(route('payments.show', ['payment_no' => 'TRX-123']))->assertNotFound();
});

test('demo admin route is unavailable', function () {
    $this->get('/demo/admin')->assertNotFound();
});

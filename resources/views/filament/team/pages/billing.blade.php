@php
    use App\Enum\RolEnum;
@endphp

<div style="margin-top: 70px;" class="w-screen flex flex-col md:flex-row md:justify-between border-t border-gray-200 dark:border-gray-700">
    <div class="px-6 py-12 dark:bg-gray-950 dark:text-white">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">
                <x-filament-panels::logo  />
                {{ env('APP_NAME', 'Laravel') }}
            </h1>
            <h2 class="text-lg font-semibold">
                {{ trans('subscription.billing_management') }}
            </h2>
            <div class="flex items-center mt-6 gap-2">
                <div>
                    {{ trans('subscription.signed_in_as') }}
                </div>
                <div>
                    {{ $user->name }}.
                </div>
            </div>
            <div class="text-sm">
                @if ($user->getRole() === RolEnum::Administrator->value)
                  adnnbub
                  {{ trans('subscription.managing_billing_for') }} {{ $tenant->name }}.
                @else
                  {{ trans('subscription.call_admin') }} {{ $user->name }}.
                @endif
            </div>
            <div class="mt-6">
                {{ trans('subscription.our_billing_management') }}
            </div>
            <x-filament::link href="{{ url(filament()->getCurrentPanel()->getId()) }}" class="mt-6" >
                {{ trans('subscription.return_to') }}
            </x-filament::link>
        </div>
    </div>

    <x-filament-actions::modals />
</div>

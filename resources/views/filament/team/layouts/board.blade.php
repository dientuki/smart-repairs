
@php
    use Filament\Support\Enums\MaxWidth;
@endphp

<x-filament-panels::layout.base :livewire="$livewire">
    @props([
        'after' => null,
        'heading' => null,
        'subheading' => null,
    ])

    @push('scripts')
        @viteReactRefresh
        @vite('board/page.tsx')
    @endpush

    <div class="fi-layout flex flex-col min-h-screen w-full overflow-x-clip ">

        <div class="fi-topbar sticky top-0 z-20 overflow-x-clip flex flex-row justify-between bg-white dark:bg-gray-900  shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10">

            <div class="fi-sidebar-header flex h-16 items-center px-6 ">
                <div>
                    @if ($homeUrl = filament()->getHomeUrl())
                        <a {{ \Filament\Support\generate_href_html($homeUrl) }}>
                            <x-filament-panels::logo />
                        </a>
                    @else
                        <x-filament-panels::logo />
                    @endif
                </div>
            </div>
                @if (($hasTopbar ?? true) && filament()->auth()->check())
                    <div
                        class="flex h-16 items-center gap-x-4 px-4 md:px-6 lg:px-8"
                    >
                        <div class="ms-auto flex items-center gap-x-4">
                            @if (filament()->hasDatabaseNotifications())
                                @livewire(Filament\Livewire\DatabaseNotifications::class, ['lazy' => true])
                            @endif

                            <x-filament-panels::user-menu />
                        </div>
                    </div>
                @endif

        </div>
        <main class="fi-main flex flex-grow mx-auto  w-full p-2 " id="app" data-bug="{{ env('BUGSNAG_API_KEY') }}" ></main>
    </div>
</x-filament-panels::layout.base>

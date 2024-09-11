
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

    <div class="fi-layout flex flex-col min-h-screen w-full overflow-x-clip gap-2 ">

        <div class="fi-topbar sticky top-0 z-20 overflow-x-clip flex flex-row justify-between bg-white dark:bg-gray-900  shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10">

        <div class="fi-sidebar-header flex h-16 items-center px-6 ">
                <x-filament-panels::logo />
            </div>

            @if (($hasTopbar ?? true) && filament()->auth()->check())
                <div
                    class="flex h-16 items-center gap-x-4 px-4  md:px-6 lg:px-8"
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

        <main class="fi-main mx-auto h-full w-full " id="app" ></main>
    </div>
</x-filament-panels::layout.base>

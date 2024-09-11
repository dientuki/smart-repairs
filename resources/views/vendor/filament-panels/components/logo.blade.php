@php
    $brandName = filament()->getTenant() ? filament()->getTenant()->name : null;
    $brandLogo = filament()->getTenant() ? filament()->getTenant()->imageUrl : null;
    $brandLogoHeight = filament()->getBrandLogoHeight() ?? '1.5rem';
    $darkModeBrandLogo = filament()->getDarkModeBrandLogo();
    $hasDarkModeBrandLogo = filled($darkModeBrandLogo);

    $getLogoClasses = fn (bool $isDarkMode): string => \Illuminate\Support\Arr::toCssClasses([
        'fi-logo',
        'inline-block' => ! $hasDarkModeBrandLogo,
        'inline-block dark:hidden' => $hasDarkModeBrandLogo && (! $isDarkMode),
        'hidden dark:inline-block' => $hasDarkModeBrandLogo && $isDarkMode,
    ]);

    $logoStyles = "height: {$brandLogoHeight}";
@endphp

@capture($content, $logo, $isDarkMode = false)
    @if ($logo instanceof \Illuminate\Contracts\Support\Htmlable)
        <div
            {{
                $attributes
                    ->class([$getLogoClasses($isDarkMode)])
                    ->style([$logoStyles])
            }}
        >
            {{ $logo }}
        </div>
    @elseif (filled($logo))
        <img
            alt="{{ __('filament-panels::layout.logo.alt', ['name' => $brandName]) }}"
            src="{{ $logo }}"
            {{
                $attributes
                    ->class([$getLogoClasses($isDarkMode)])
                    ->style([$logoStyles])
            }}
        />
        <span
            {{
                $attributes->class([
                    $getLogoClasses($isDarkMode),
                    'relative top-1 text-xl font-bold leading-5 tracking-tight text-gray-950 dark:text-white',
                ])
            }}
        >
            {{ $brandName }}
        </span>
    @else
        <div
            {{
                $attributes->class([
                    $getLogoClasses($isDarkMode),
                    'text-xl font-bold leading-5 tracking-tight text-gray-950 dark:text-white',
                ])
            }}
        >
            {{ $brandName }}
        </div>
    @endif
@endcapture

{{ $content($brandLogo) }}

@if ($hasDarkModeBrandLogo)
    {{ $content($darkModeBrandLogo, isDarkMode: true) }}
@endif

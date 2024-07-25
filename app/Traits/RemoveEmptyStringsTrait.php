<?php

namespace App\Traits;

trait RemoveEmptyStringsTrait {

    // Use the `creating` and `updating` events to clean data
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->attributes = self::removeEmptyStrings($model->attributes);
        });

        static::updating(function ($model) {
            $model->attributes = self::removeEmptyStrings($model->attributes);
        });
    }

    /**
     * Remove elements with empty string values from the array.
     *
     * @param array $attributes
     * @return array
     */
    protected static function removeEmptyStrings(array $attributes): array
    {
        return array_filter($attributes, function($value) {
            return $value !== "";
        });
    }
}
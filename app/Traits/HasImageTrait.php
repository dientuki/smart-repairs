<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

trait HasImageTrait
{
    protected string $imageField = 'hash_filename';

    /**
     * Registers event listeners for the `booted` method.
     *
     * This method registers two event listeners: one for the `deleted` event and one for the `updated` event.
     *
     * The `deleted` event listener checks if the `avatar` attribute of the model is not null. If it is not null,
     * it deletes the file associated with the `avatar` attribute from the disk with the name 'public'.
     *
     * The `updated` event listener checks if the `hash_filename` attribute of the model has been modified. If
     * it has been modified and the original value of the `hash_filename` attribute is not null, it deletes
     * the file associated with the original value of the `hash_filename` attribute from the disk with the
     * name 'public'.
     *
     * @return void
     */
    protected static function booted()
    {
        self::deleted(function (self $model) {
            if ($model->avatar !== null) {
                Storage::disk('public')->delete($model->avatar);
            }
        });

        self::updated(function (self $model) {
            if ($model->isDirty($model->imageField) && $model->getOriginal($model->imageField) !== null) {
                Storage::disk('public')->delete($model->getOriginal($model->imageField));
            }
        });
    }

    /**
     * Retrieves the URL of the image associated with the current object.
     *
     * @return Attribute The attribute object containing the URL of the image.
     */
    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $attributes[$this->imageField] ?? null ? Storage::url($attributes[$this->imageField]) : null
        );
    }
}

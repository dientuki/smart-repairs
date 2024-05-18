<?php
namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

trait HasImageTrait
{

    /**
     * Retrieves the URL of the image associated with the current object.
     *
     * @return Attribute The attribute object containing the URL of the image.
     */
    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => Storage::url($attributes[$this->imageField ?? 'image'])
        );
    }
}

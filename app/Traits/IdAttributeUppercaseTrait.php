<?php

namespace App\Traits;

trait IdAttributeUppercaseTrait
{
    /**
     * Set the ID attribute to uppercase when setting.
     *
     * @param  string  $value
     * @return void
     */
    public function setIdAttribute($value)
    {
        $this->attributes['id'] = strtoupper($value);
    }
}

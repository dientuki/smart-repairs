<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ModelAuditable extends Model implements Auditable
{
    use HasUlids;
    use HasFactory;

    use \OwenIt\Auditing\Auditable;

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

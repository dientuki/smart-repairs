<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Team;

class ModelWithTeam extends Model
{
    /**
     * Method to define the relationship with the Team model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */    
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}

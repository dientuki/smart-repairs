<?php
namespace App\Traits;

trait EnumAsArrayTrait
{

    /**
     * Returns an array containing the values of all cases in the UnlockEnum.
     *
     * @return array An array of string values representing the cases in the UnlockEnum.
     */
    public static function getAllCasesAsArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}

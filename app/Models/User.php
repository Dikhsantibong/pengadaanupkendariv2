<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Check if the user has any asmen role
     */
    public function isAsmen(): bool
    {
        return str_starts_with($this->role, 'asmen_');
    }

    /**
     * Check if the user is a manager (super admin)
     */
    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    /**
     * Get the asmen bidang from the role name
     * e.g. 'asmen_pemeliharaan' => 'pemeliharaan'
     */
    public function getAsmenBidang(): ?string
    {
        if (!$this->isAsmen()) {
            return null;
        }

        return str_replace('asmen_', '', $this->role);
    }

    /**
     * Get readable label for the asmen bidang
     */
    public function getAsmenLabel(): string
    {
        $labels = [
            'asmen_pemeliharaan' => 'Asmen Pemeliharaan',
            'asmen_operasi' => 'Asmen Operasi',
            'asmen_engineering' => 'Asmen Engineering',
            'asmen_business_support' => 'Asmen Business Support',
            'asmen_k3' => 'Asmen K3',
            'asmen_lingkungan' => 'Asmen Lingkungan',
        ];

        return $labels[$this->role] ?? 'Asmen';
    }

    /**
     * Pengadaan that this user is assigned as direksi
     */
    public function pengadaanDireksi(): BelongsToMany
    {
        return $this->belongsToMany(Pengadaan::class, 'pengadaan_direksi')->withTimestamps();
    }
}

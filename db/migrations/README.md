# db/migrations

Each migration is a pair of plain SQL files:

| File | Purpose |
|------|---------|
| `NNNN_<name>.up.sql`   | Apply the migration (run to move forward) |
| `NNNN_<name>.down.sql` | Rollback the migration (run to undo) |

## Running migrations

Migrations are intentionally plain SQL — paste them into the Neon console,
or run them via `psql`:

```bash
# apply
psql "$DATABASE_URL" -f db/migrations/0001_game_progression.up.sql

# rollback
psql "$DATABASE_URL" -f db/migrations/0001_game_progression.down.sql
```

## Current migrations

| # | Name | Tables / changes |
|---|------|-----------------|
| 0001 | game_progression | Extends `user` with XP/streak columns; adds `practice_sessions`, `user_achievements` |

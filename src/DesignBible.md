Vision & Design Principles

Math first. Every feature must reinforce math fluency (accuracy + speed) without distracting gimmicks.

Progression = reward. Players progress by mastering skills; cosmetics, biomes, and flair are earned through practice.

No gambling loops. No loot boxes, no paid/randomized rolls with real money. If randomness exists (e.g., daily shop rotation), it’s transparent and non-monetary.

Short, satisfying sessions. A round should feel good in 3–5 minutes; players should see progress (XP/levels/goo) every session.

Kid-friendly & respectful. No dark patterns; clear feedback; forgiving mistakes; uplifting audio/visual cues.

Simple to extend. New math skills, skins, badges, or buddies can be added with data only (no logic rewrite).

Core Systems
Skills & Difficulty

Skill order (V1):
add_1_10 → add_1_20 → sub_1_10 → sub_1_20 → mul_0_5_10 → mul_0_10 → div_facts → mixed_all

Problem generation: Deterministic ranges per skill. V1 clamps distractors to ≥ 0 (no negative answers yet).

Mastery gate: Unlock next skill once prior is mastered.

Thresholds (V1): minAttempts: 20, accuracy ≥ 90%, avgTime ≤ 6s.

Mastery perk: each mastered skill grants +5% reward multiplier, capped at +25% total.

Future: add negative subtraction, larger ranges, multi-step, word problems as additional skills.

Rewards & Economy

Currencies:

XP → levels; scales required XP per level.

Goo → cosmetic purchases.

XP to next level (V1): 100 + 40*(level-1), capped at 1400.

Per-question rewards (V1):

Base: 10 points.

Streak bonus: +2 * currentStreak (capped at +50).

Difficulty multiplier: per skill (e.g., add_1_10 = 1.00 … mixed_all = 1.50).

Mastery multiplier: 1.00 → 1.25 (see above).

Speed goo bonus: <1.5s: +5 goo, <3s: +3 goo, else +0 (doesn’t affect XP).

Level-up bonus: On level increase, grant (20 + 5*newLevel) goo.

Session end: Best score/streak tracked; summary shows XP & goo breakdown (base / streak / speed).

Shop

Inventory size: 8 items

4 Evergreen (always available; typically Common/Uncommon basics)

4 Daily Picks (rotates daily; includes higher rarities)

Refresh: Optional goo spend to reroll daily picks. Cost increases with each refresh and resets daily. No real money, ever.

Pricing by rarity (V1):

Common: 100 goo

Uncommon: 250 goo

Rare: 500 goo

Epic: 1000 goo

Mythic: 2500 goo

Presentation: Every item shows name, rarity pill (color-coded), and goo price using the same icon as the HUD.

Economy intent: Early commons in ~5–10 minutes of play; higher tiers take meaningfully longer but feel achievable with steady practice.

Cosmetics & Themes
Rarity Tiers & Naming

Common (solid colors): Green, Mint, Blueberry, Lemon, Cherry, Slate, Seafoam, Grape, Tangerine, Bubblegum.
Goal: approachable, readable, easy to earn.

Uncommon (simple gradients): e.g., Spring, Sunset, Lagoon, Frost, Peach Pop… soft 2-stop blends.

Rare (patterns): Polka, Stripe, Sprinkles, Honeycomb, Pixel, Waves… subtle; must maintain number legibility.

Epic (animated basics): Lava, Aurora, Ocean Drift, Breathing Jelly, Glow Pulse… low-motion, battery-friendly.

Mythic (animated + effects): Nebula, Phoenix, Leviathan, Pegasus, Zeus… tasteful particles (twinkles, wisps), still readable.

Secret (event/quest): Very rare nods (e.g., “Bigfoot”). Parody-style, no direct IP.

Art constraints: Every slime must keep facial readability on solid white and on soft biome backgrounds. Limit motion to gentle loops; never obstruct equation/answers.

Biomes (progress-gated)

Unlock biomes at level milestones to make level ups feel like “new worlds.”

Suggested gates (tune as needed): Lv1 Meadow → Lv5 Beach → Lv10 Desert → Lv15 Forest → Lv20 Tundra → Lv30 Aurora → Lv40 Nebula.

Biome is a full-bleed layer behind play; QuestionCard can be transparent to let it shine.

Accessories & Buddies (Post-V1)

Accessories (hats/eyes/mouth/aura/trail) use the same rarity language; equippable in combination, but keep silhouettes clean.

Buddies are separate from cosmetics; they grant small, understandable boosts (e.g., +1 life per session, +5% streak goo).

Acquisition: via mastery/quests/levels—not shop purchase—to avoid pay-to-win.

Cap stacking to prevent runaway compounding.

UX Rules

HUD: minimal and readable. Always show Hearts, Goo, XP progress, Skill selector. Secondary buttons (Shop/Progress/End) can live in a bottom or side bar.

Question flow:

On wrong answer, keep the same question; disable the chosen option; decrement a life.

Distinct audio/visual cues for: correct, wrong, speed bonus, streak milestone (every 5), and level-up.

Feedback: Level progress bar plus celebratory burst on level-up.

Session control: An End Session button (not just losing all lives).

Profiles: Local, multiple kids, renameable, per-profile unlocks and settings.

Accessibility: High contrast, large tappable options, low-motion mode (future toggle), sounds toggle.

Content & Safety Constraints

No real-money purchases. No ads. No external links for kids to tap accidentally.

No loot boxes or “spend for odds.” Daily rotation is deterministic; refresh cost is transparent.

Parody-style references only. Clear nods, not copyrighted characters/logos. Keep everything original enough to be safe.

Data Model (high-level)

Profile: { id, name, color, xp, level, goo, settings: { soundOn, activeSkin }, unlocks: { skins[], biomes[] }, mastered: { [skillId]: true }, skillStats: { attempts, correct, totalMs, avgMs }, best: { score, streak }, dailyRefresh: { count, seed, lastDate } }

Skin item: { id, type: 'skin', skin: 'grape', tier: 'rare' }

Biome: { id, name, levelGate, render(props) }

Skill: { id, label, op, ranges, diff }

Balancing Knobs (keep in one place)

XP_BASE = 100, XP_STEP = +40, XP_CAP = 1400

BASE_REWARD = 10, STREAK_BONUS = 2*streak (cap 50)

SPEED_GOO: <1.5s → +5, <3s → +3, else 0

MASTERY_PERK = +5% each, cap +25%

LEVEL_UP_GOO = 20 + 5*level

Shop: PRICES {100, 250, 500, 1000, 2500}; INVENTORY = 8 (4 evergreen, 4 daily); REFRESH_COST scaling table (e.g., 100/200/400; reset daily)

Build & Extensibility Guidelines

Data-driven registries: skills, skins, accessories, biomes, badges live in assets/* or core/* registries; adding items shouldn’t require touching game logic.

Pure functions for math: generation + reward calculation are deterministic and unit-tested.

Local-first storage: Profiles in localStorage; versioned migrations.

Small, testable UI units: HUD, QuestionCard, ShopCard, Progress modal, Slime renderer are independent.

Performance: Avoid heavy animations; use CSS/transforms; keep particle counts low; batch re-renders.

“Done” Checklist for any new content

Clear readability on white and on biomes.

No visual clutter around the equation/answers.

Economy fit: price vs. average session earnings considered.

No direct IP; nod is tasteful, safe.

Telemetry (optional) logs only anonymous, non-PII aggregates (accuracy, time per skill) for difficulty tuning.
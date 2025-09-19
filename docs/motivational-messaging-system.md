# Motivational Messaging System - Full Specification

## Overview
This document contains the complete specification for the advanced motivational messaging system for the Session Summary screen. This system was designed to provide personalized, context-aware feedback to players based on their performance patterns.

## Current Status
**IMPLEMENTED**: Simple motivational messages (4 conditions, basic rotation)
**PENDING**: Full advanced system (50+ messages, complex decision logic, delta comparisons)

## Full System Specification

### Core Features
1. **Delta Comparisons**: Compare current run to previous run of same skill
2. **Motivational Messages**: 50+ contextual messages with priority system
3. **Message Rotation**: Avoid repeating last 2 messages from each category
4. **Button State Management**: Disable "Continue" until animations complete
5. **Rolling Accuracy Display**: Show "(n/N)" format when needed

### Message Categories & Conditions

#### Accuracy-Based Messages
- **Accuracy up ≥ 3pp**: "Accuracy leveled up—your slime is **oozing** focus!"
- **Accuracy steady ≥ 80%**: "Rock-solid jelly. Keep that **steady squish** going."
- **Accuracy recovery** (prev <70%, now ≥75%): "Bounce-back blob! That's how skills **grow**."
- **Accuracy down**: "Tricky goo today. Slow the squish—**you'll rebound**."

#### Speed-Based Messages
- **Speed faster & accuracy ≥ 80%**: "Swift **and** precise—chef's kiss of slime."
- **Speed faster but accuracy down**: "Zoomy blob! Now add a **calm squish** for cleaner hits."

#### Streak-Based Messages
- **First session after multi-day gap**: "Welcome back! Warm-up **ooze** still builds power."
- **Streak ≥ 5 days**: "Day {n}! Your slime's **on a roll**—literally."

#### Special Achievement Messages
- **Perfect Accuracy (100%)**: "Perfect **goo-l**! 100% stickiness achieved."
- **Correct-in-a-Row Streak**: "{streak} in a row—your slime's on **auto-glue**!"
- **New PR Accuracy**: "New PR accuracy: **{acc}%**! You leveled up your goo-precision."
- **New PR Speed**: "Speed PR: **{time}s**! Turbo ooze, steady aim."
- **Skill Mastery Achieved**: "Mastery unlocked: **{skill}**! Your slime bows."
- **Clean Focus Run**: "Zen-slime mode: zero turbo taps. Smooth focus!"

### Priority System
When multiple conditions match, prioritize in this order:
1. **Skill Mastery** → 2) **Perfect Accuracy** → 3) **Accuracy PR** → 4) **Speed PR** → 5) **Goo/XP PR** → 6) **Correct-streak PR** → 7) **Clean Focus** → 8) **Streak day PR** → else use standard case

### Technical Requirements

#### Data Storage
- Store previous run metrics per skill: `{ skillId, accuracy, speed, goo, xp, timestamp }`
- Implement data migration for existing players
- Handle edge cases: no previous run, skill changes, data corruption

#### Delta Calculations
- **Accuracy Delta**: `currentRollingAccuracy - previousRollingAccuracy`
- **Speed Delta**: `currentWeightedSpeed - previousWeightedSpeed`
- **Rolling Accuracy**: Use tier-based buffers (20/25/30 answers)
- **Speed Calculation**: Weighted average of last 20 counted answers

#### Message Rotation
- Track last 2 messages used per category
- Random selection from available messages (excluding last 2)
- Reset rotation when category changes

#### UI State Management
- Disable "Continue" button until animations complete (≤3.0s total)
- Show delta arrows: ↗️ for improvements, ↘️ for declines
- Display "(n/N)" format for rolling accuracy when n < N

## Risk Assessment

### High-Risk Areas
1. **Data Storage & Retrieval**: Previous run data corruption, missing data
2. **Complex Decision Logic**: 50+ conditions with priority ordering
3. **Delta Calculations**: Rolling accuracy comparisons, weighted averages
4. **UI State Management**: Button timing, message display, responsive design

### Likely Bug Scenarios
- "Undefined is not a number" - Missing previous run data
- Wrong message priority - Speed message shows instead of accuracy
- Broken delta math - Shows "accuracy up" when actually down
- Animation timing bugs - Button enables before animations finish
- Message repetition - Same message shows 3 times in a row
- Edge case crashes - Player with 0 previous runs, skill changes

### Time Estimates
- **"Quick" implementation**: 2-3 days (high bug risk)
- **"Robust" implementation**: 1-2 weeks (proper testing, edge cases)
- **Debugging phase**: 1-3 days (inevitable bugs)

## Future Enhancements

### Seasonal Messages
- **Holiday themes**: Christmas, Halloween, summer break
- **School year context**: Back to school, end of year, testing season
- **Weather themes**: Rainy day encouragement, sunny day energy

### Personalization
- **Learning style adaptation**: Visual, auditory, kinesthetic learners
- **Difficulty preference**: Challenge seekers vs. steady progress
- **Time-based patterns**: Morning vs. evening performance

### Advanced Analytics
- **Performance trends**: Weekly/monthly progress tracking
- **Skill correlation**: Which skills improve together
- **Optimal practice time**: When player performs best

## Implementation Notes

### Current Simple System
- 4 basic conditions with 3-4 message variations each
- Random rotation (no tracking)
- Session-based accuracy (not rolling)
- Boundary conditions included (≥80%, ≥70%, ≥10, ≤2s)

### Migration Path
1. **Phase 1**: Simple system (current)
2. **Phase 2**: Add previous run data storage
3. **Phase 3**: Add delta calculations
4. **Phase 4**: Add full message system
5. **Phase 5**: Add seasonal/personalization features

### Testing Strategy
- **Unit tests**: Message selection logic, delta calculations
- **Integration tests**: Data storage/retrieval, UI state management
- **User testing**: Message clarity, emotional impact, repetition fatigue
- **Edge case testing**: Boundary conditions, missing data, skill changes

## Conclusion
The full motivational messaging system is a sophisticated feature that would significantly enhance player engagement. However, it carries high implementation risk and complexity. The current simple system provides immediate value while maintaining low risk for the current release.

**Recommendation**: Implement full system as a separate major feature after current release, with dedicated development time and thorough testing.

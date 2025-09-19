# Analytics System Specification

## Overview
This document outlines the complete specification for implementing an analytics system in Slime Collector. The system is designed to track user behavior, performance metrics, and gameplay patterns to support future teacher dashboards and player statistics.

## Current Status
**DEFERRED**: Analytics system implementation postponed to future release
**REASON**: High complexity, medium risk, low immediate value for current release
**ALTERNATIVE**: Minimal debug logging implemented for development

## System Requirements

### Core Features
1. **Event Tracking**: Capture user interactions and gameplay events
2. **Data Persistence**: Store events locally and/or remotely
3. **Performance Monitoring**: Track answer times, accuracy, and progression
4. **Behavioral Analytics**: Understand player patterns and engagement
5. **Privacy Compliance**: COPPA-compliant data collection for children

### Event Categories

#### Answer Events
- `answer_submitted`: `{ t_ms, correct, scrub, skill, timestamp, sessionId }`
- `answer_scrubbed`: `{ reason: 'mis_tap' | 'turbo', original_t_ms, timestamp }`
- `turbo_detected`: `{ streak, t_ms, skill, timestamp }`

#### Session Events
- `session_started`: `{ skill, level, timestamp, sessionId }`
- `session_ended`: `{ duration, xp, goo, accuracy, speed, timestamp }`
- `skill_changed`: `{ from_skill, to_skill, timestamp }`
- `level_up`: `{ new_level, xp_gained, timestamp }`

#### UI Events
- `modal_opened`: `{ modal_type: 'intercept' | 'summary' | 'shop', timestamp }`
- `modal_closed`: `{ modal_type, duration, action: 'break' | 'continue' | 'close', timestamp }`
- `button_clicked`: `{ button: 'take_break' | 'play_again' | 'keep_playing', location, timestamp }`

#### Progression Events
- `mastery_achieved`: `{ skill, accuracy, speed, attempts, timestamp }`
- `world_unlocked`: `{ world, required_skill, timestamp }`
- `badge_earned`: `{ badge_type, criteria_met, timestamp }`

## Implementation Options

### Option A: Build from Scratch ⚠️ HIGH RISK
**Time Estimate**: 1-2 weeks
**Complexity**: Very High

#### Pros
- Complete control over data structure
- No external dependencies
- Customized for specific needs
- No data sharing with third parties

#### Cons
- Complex event queuing system
- Data serialization/deserialization
- Error handling and recovery
- Cross-browser compatibility testing
- Performance optimization required
- Storage management complexity

#### Technical Requirements
- Event queue with batching
- Data persistence layer (localStorage/IndexedDB)
- Error recovery mechanisms
- Memory management
- Schema versioning
- Data migration system

### Option B: Lightweight Analytics Package ✅ MEDIUM RISK
**Time Estimate**: 2-3 days
**Complexity**: Medium

#### Recommended Packages
1. **PostHog** (Self-hosted)
   - Feature flags + analytics
   - Privacy-focused
   - Self-hosted option available
   - Good for educational apps

2. **Mixpanel** (Lightweight)
   - Event tracking focused
   - Simple API
   - Good documentation
   - Reasonable pricing

3. **Amplitude** (Educational)
   - Education-focused features
   - Cohort analysis
   - Good for learning analytics

#### Implementation Steps
1. Package integration
2. Event schema definition
3. Privacy settings configuration
4. Data collection implementation
5. Testing and validation

### Option C: Minimal Custom Implementation ✅ LOW RISK
**Time Estimate**: 4-6 hours
**Complexity**: Low

#### Scope
- Basic event logging to console (dev mode)
- Simple localStorage persistence
- Foundation for future expansion

#### Implementation
```typescript
// Simple event logger
const logEvent = (event: string, data: any) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}:`, data);
  }
  
  // Store in localStorage for persistence
  const events = JSON.parse(localStorage.getItem('slime_analytics') || '[]');
  events.push({ event, data, timestamp: Date.now() });
  localStorage.setItem('slime_analytics', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
};

// Usage throughout app
logEvent('answer_submitted', { correct, t_ms, skill });
logEvent('intercept_triggered', { turboStreak, cooldown });
```

## Risk Assessment

### HIGH RISK Areas
1. **Data Architecture & Storage**
   - Event schema design complexity
   - Data persistence reliability
   - Storage limit management
   - Cross-browser compatibility

2. **Performance Impact**
   - Event collection blocking UI
   - Memory leaks from accumulating events
   - Storage I/O performance
   - Background processing

3. **Privacy & Compliance**
   - COPPA compliance for children
   - Data minimization requirements
   - User consent management
   - Data retention policies

4. **Data Integrity**
   - Event loss during app crashes
   - Corrupted data recovery
   - Schema evolution handling
   - Data migration complexity

### MEDIUM RISK Areas
1. **Event Timing**
   - Race conditions in event collection
   - Timing accuracy for performance metrics
   - Session boundary detection

2. **Memory Management**
   - Accumulating event objects
   - Garbage collection impact
   - Memory leak prevention

3. **Network Resilience**
   - Offline/online event handling
   - Data synchronization
   - Network failure recovery

### LOW RISK Areas
1. **Basic Logging**
   - Console.log implementation
   - Simple localStorage usage
   - Development debugging

2. **Event Definition**
   - Clear event schemas
   - Consistent naming conventions
   - TypeScript type safety

## Privacy & Compliance Considerations

### COPPA Compliance (Children's Online Privacy Protection Act)
- **Data Minimization**: Only collect necessary data
- **Parental Consent**: Required for children under 13
- **Data Security**: Secure storage and transmission
- **Data Retention**: Limited retention periods
- **Third-Party Sharing**: Restricted or prohibited

### Data Collection Principles
1. **Minimal Data**: Only collect what's needed for functionality
2. **Purpose Limitation**: Use data only for stated purposes
3. **Storage Limitation**: Don't keep data longer than necessary
4. **Accuracy**: Ensure data accuracy and relevance
5. **Security**: Protect data from unauthorized access

### Recommended Data Practices
- **Anonymization**: Remove or hash personal identifiers
- **Local Storage**: Prefer local storage over remote transmission
- **Opt-in**: Make analytics optional for users
- **Transparency**: Clear privacy policy and data usage

## Future Enhancements

### Teacher Dashboard Features
- **Class Performance**: Aggregate student progress
- **Skill Mastery**: Track skill completion rates
- **Engagement Metrics**: Time spent, session frequency
- **Problem Areas**: Identify common difficulty points
- **Progress Reports**: Generate student progress summaries

### Player Statistics
- **Personal Progress**: Individual performance tracking
- **Achievement History**: Badge and milestone tracking
- **Skill Development**: Progress over time
- **Goal Setting**: Personal improvement targets

### Advanced Analytics
- **Predictive Modeling**: Identify at-risk students
- **Adaptive Learning**: Adjust difficulty based on performance
- **Engagement Optimization**: Improve retention strategies
- **A/B Testing**: Test different game mechanics

## Implementation Timeline

### Phase 1: Foundation (Current - Deferred)
- Basic event logging
- Local storage implementation
- Privacy compliance setup
- **Status**: Deferred to future release

### Phase 2: Core Analytics
- Event collection system
- Data persistence layer
- Basic reporting capabilities
- **Estimated Time**: 1-2 weeks

### Phase 3: Advanced Features
- Teacher dashboard
- Player statistics
- Advanced reporting
- **Estimated Time**: 2-3 weeks

### Phase 4: Optimization
- Performance improvements
- Advanced analytics
- Machine learning integration
- **Estimated Time**: 1-2 weeks

## Current Alternative: Debug Logging

### Implementation Status
**COMPLETED**: Minimal debug logging implemented for development

### Features
- Console logging in development mode
- Basic event tracking for debugging
- Foundation for future analytics system
- Zero risk to current release

### Usage
```typescript
// Already implemented in current codebase
console.log('🎯 Answer submitted:', { correct, t_ms, skill });
console.log('🚨 Turbo detected:', { streak, t_ms });
console.log('📊 Session summary:', { xp, goo, accuracy });
```

## Conclusion

The analytics system is a valuable feature for future development but carries significant implementation risk and complexity. The current Phase 2 implementation provides excellent functionality without the analytics overhead.

**Recommendation**: 
1. **Ship current Phase 2** - Complete, polished, and ready for release
2. **Plan analytics as Phase 3** - Dedicated project with proper planning
3. **Use debug logging** - Current implementation provides development insights
4. **Consider Option C** - Minimal implementation when ready to proceed

**Next Steps**:
- Complete current release with existing functionality
- Plan dedicated analytics project for future release
- Gather requirements from teachers/educators
- Evaluate analytics packages and compliance requirements
- Design data architecture and privacy framework

## References
- [COPPA Compliance Guide](https://www.ftc.gov/tips-advice/business-center/privacy-and-security/children's-privacy)
- [PostHog Documentation](https://posthog.com/docs)
- [Mixpanel Education](https://mixpanel.com/education/)
- [Amplitude for Education](https://amplitude.com/education)

import { 
  trigger, 
  state,
  group,
  style,
  animate,
  transition,
  query,
  stagger,
  animateChild,
  AnimationTriggerMetadata,
  animation,
  AnimationReferenceMetadata
} from '@angular/animations';

export const gridAnimations = animation([
  trigger('input', [
    // state('medium', style({'grid-row': 1, 'grid-column': 1})),
    // state('small', style({'grid-row': 2, 'grid-column': 1})),
    transition('medium => small', animate('100ms ease')),
    transition('small => medium', animate('100ms ease'))
  ]),
  trigger('output', [
    // state('medium', style({'grid-row': 2, 'grid-column': 1})),
    // state('small', style({'grid-row': 2, 'grid-column': 2})),
    transition('medium => small', animate('100ms ease')),
    transition('small => medium', animate('100ms ease'))
  ]),
  trigger('result', [
    // state('medium', style({'grid-row': '1 / span 2', 'grid-column': 2})),
    // state('small', style({'grid-row': 1, 'grid-column': '1 / span 2'})),
    transition('medium => small', animate('100ms ease')),
    transition('small => medium', animate('100ms ease'))
  ]),
])
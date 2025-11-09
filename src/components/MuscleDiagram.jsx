// ✅ STEP 1: Import all your new highlight images
import frontViewImage from '../assets/front-view.png';
import backViewImage from '../assets/back-view.png';

// --- Red Highlights (Stage 1) ---
import backHighlightRed from '../assets/highlight-back.png';
import bicepsHighlightRed from '../assets/highlight-biceps.png';
import chestHighlightRed from '../assets/highlight-chest.png';
import coreHighlightRed from '../assets/highlight-core.png';
import hamstringsHighlightRed from '../assets/highlight-hamstrings.png';
import quadsHighlightRed from '../assets/highlight-quads.png';
import shoulderHighlightRed from '../assets/highlight-shoulder.png';
import tricepsHighlightRed from '../assets/highlight-triceps.png';
import calvesHighlightRed from '../assets/highlight-calves.png';

// --- Yellow Highlights (Stage 2) ---
import backHighlightYellow from '../assets/highlight-back-yellow.png';
import bicepsHighlightYellow from '../assets/highlight-biceps-yellow.png';
import chestHighlightYellow from '../assets/highlight-chest-yellow.png';
import coreHighlightYellow from '../assets/highlight-core-yellow.png';
import hamstringsHighlightYellow from '../assets/highlight-hamstrings-yellow.png';
import quadsHighlightYellow from '../assets/highlight-quads-yellow.png';
import tricepsHighlightYellow from '../assets/highlight-triceps-yellow.png';
import calvesHighlightYellow from '../assets/highlight-calves-yellow.png';
import shoulderHighlightYellow from '../assets/highlight-shoulder-yellow.png'; // ✅ ADD THIS LINE
// --- Green Highlights (Stage 3) ---
import backHighlightGreen from '../assets/highlight-back-green.png';
import bicepsHighlightGreen from '../assets/highlight-biceps-green.png';
import chestHighlightGreen from '../assets/highlight-chest-green.png';
import coreHighlightGreen from '../assets/highlight-core-green.png';
import hamstringsHighlightGreen from '../assets/highlight-hamstrings-green.png';
import quadsHighlightGreen from '../assets/highlight-quads-green.png';
import tricepsHighlightGreen from '../assets/highlight-triceps-green.png';
import calvesHighlightGreen from '../assets/highlight-calves-green.png';
import shoulderHighlightGreen from '../assets/highlight-shoulder-green.png'; // ✅ ADD THIS LINE


import headFrontHighlight from '../assets/headfront-highlight.png';
import headBackHighlight from '../assets/headback-highlight.png';


// ✅ STEP 2: Create mapping objects for easy lookup
const redHighlights = {
  1: chestHighlightRed,
  2: backHighlightRed,
  3: coreHighlightRed,
  4: shoulderHighlightRed,
  5: bicepsHighlightRed,
  6: tricepsHighlightRed,
  7: quadsHighlightRed,
  8: hamstringsHighlightRed,
  9: calvesHighlightRed,
};
const yellowHighlights = {
  1: chestHighlightYellow,
  2: backHighlightYellow,
  3: coreHighlightYellow,
  4: shoulderHighlightYellow,
  5: bicepsHighlightYellow,
  6: tricepsHighlightYellow,
  7: quadsHighlightYellow,
  8: hamstringsHighlightYellow,
  9: calvesHighlightYellow,
};
const greenHighlights = {
  1: chestHighlightGreen,
  2: backHighlightGreen,
  3: coreHighlightGreen,
  4: shoulderHighlightGreen,
  5: bicepsHighlightGreen,
  6: tricepsHighlightGreen,
  7: quadsHighlightGreen,
  8: hamstringsHighlightGreen,
  9: calvesHighlightGreen,
};


// This configuration defines where the clickable hotspots are.
// It no longer needs the 'highlight' property for rendering overlays.
const muscleHotspotConfig = {
  1: { // Chest
    styles: [{ top: '20%', left: '33%', width: '32%', height: '10%' }],
    view: 'front'
  },
  2: { // Back
    styles: [{ top: '17%', left: '36%', width: '30%', height: '26%' }],
    view: 'back'
  },
  3: { // Core
    styles: [{ top: '30%', left: '41%', width: '15%', height: '18%' }],
    view: 'front'
  },
  4: { // Shoulders
    styles: [
      { top: '18%', left: '22%', width: '14%', height: '9%' }, // Left
      { top: '18%', left: '61%', width: '14%', height: '9%' }  // Right
    ],
    view: 'front'
  },
  5: { // Biceps
    styles: [
      { top: '27%', left: '21%', width: '10%', height: '12%' }, // Left
      { top: '27%', left: '67%', width: '10%', height: '12%' }  // Right
    ],
    view: 'front'
  },
  6: { // Triceps
    styles: [
      { top: '27%', left: '22%', width: '10%', height: '14%' },
      { top: '27%', left: '71%', width: '10%', height: '14%' }
    ],
    view: 'back'
  },
 7: { // Quads
    styles: [
      { top: '53%', left: '28%', width: '19%', height: '21%' }, // Left Quad
      { top: '53%', left: '51%', width: '19%', height: '21%' }  // Right Quad
    ],
    view: 'front'
},
    8: { // Hamstrings
    styles: [
      { top: '54%', left: '38%', width: '10%', height: '18%' }, // Left Hamstring
      { top: '54%', left: '54%', width: '10%', height: '18%' }  // Right Hamstring
    ],
    view: 'back'
  },
  9: { // Calves
    styles: [
      { top: '73%', left: '37%', width: '11%', height: '9%' }, // Left Calf
      { top: '73%', left: '54%', width: '11%', height: '9%' }  // Right Calf
    ],
    view: 'back'
  },
   10: { // Head
    styles: [{ top: '1%', left: '40%', width: '20%', height: '15%' }],
    view: 'both' // Using a special 'both' view to signify it appears on front and back
  }
  
};

// This is the correct style for your cropped highlight images.
const highlightOverlayStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none'
};

// ✅ STEP 3: Update the component props and logic
function MuscleDiagram({ isShowingFront, recoveryStates, handleMuscleClick, muscleGroups,  isDietGenerated, onHeadClick, }) {
  return (
    <div className="diagram-container">
      <img
        src={isShowingFront ? frontViewImage : backViewImage}
        alt="Muscle diagram"
        className="muscle-diagram"
      />

       {/* ✅ STEP 3: Add rendering for the head highlight */}
      {isDietGenerated && (
        <img
          src={isShowingFront ? headFrontHighlight : headBackHighlight}
          alt="Diet plan generated highlight"
          className="highlight-overlay"
          style={highlightOverlayStyle}
        />
      )}

      {/* ✅ UPGRADED: Dynamic multi-color rendering */}
      {muscleGroups.map(muscle => {
        const config = muscleHotspotConfig[muscle.id];
        const stage = recoveryStates[muscle.id];
        
        if (config && stage && (config.view === 'front' ? isShowingFront : !isShowingFront)) {
          let highlightImage;
          if (stage === 1) highlightImage = redHighlights[muscle.id];
          else if (stage === 2) highlightImage = yellowHighlights[muscle.id];
          else if (stage === 3) highlightImage = greenHighlights[muscle.id];

          if (highlightImage) {
            return (
              <img
                key={`highlight-${muscle.id}`}
                src={highlightImage}
                alt={`${muscle.name} highlight stage ${stage}`}
                className="highlight-overlay"
                style={highlightOverlayStyle}
              />
            );
          }
        }
        return null;
      })}

      {/* Renders the clickable hotspot buttons (This part doesn't need to change!) */}
      {muscleGroups.map(muscle => {
        const config = muscleHotspotConfig[muscle.id];
        if (config && config.styles && (config.view === 'front' ? isShowingFront : !isShowingFront)) {
          return config.styles.map((style, index) => (
            <button
              key={`hotspot-${muscle.id}-${index}`}
              className="muscle-hotspot"
              style={style}
              onClick={() => handleMuscleClick(muscle)}
              aria-label={`Toggle ${muscle.name} Workout`}
            ></button>
          ));
        }
        return null;
      })}


      {/* ✅ STEP 4: Add rendering for the clickable head hotspot */}
      {(() => {
        const headConfig = muscleHotspotConfig[10];
        if (headConfig && headConfig.styles) {
          return headConfig.styles.map((style, index) => (
            <button
              key={`hotspot-head-${index}`}
              className="muscle-hotspot"
              style={style}
              onClick={onHeadClick}
              aria-label="Get Diet Recommendation"
            ></button>
          ));
        }
        return null;
      })()}
    </div>
  );
}

export default MuscleDiagram;
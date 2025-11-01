import backHighlight from '../assets/highlight-back.png';
import bicepsHighlight from '../assets/highlight-biceps.png';
import chestHighlight from '../assets/highlight-chest.png';
import coreHighlight from '../assets/highlight-core.png';
import hamstringsHighlight from '../assets/highlight-hamstrings.png';
import quadsHighlight from '../assets/highlight-quads.png';
import shoulderHighlight from '../assets/highlight-shoulder.png';
import tricepsHighlight from '../assets/highlight-triceps.png';
// Note: You will need to create and import a 'highlight-calves.png' if you want calves to light up.
import frontViewImage from '../assets/front-view.png';
import backViewImage from '../assets/back-view.png';
import calvesHighlight from '../assets/highlight-calves.png'; // <-- ADD THIS LINE

// --- FINAL, VERIFIED, AND CORRECTED VERSION ---
// This configuration correctly maps the Chest button to the chest area (ID 1)
// and the Shoulder buttons to the shoulder areas (ID 4).
// --- FINAL VERSION, REBUILT FROM YOUR VISUAL DEBUGGING ---
// All previous coordinates have been discarded. This is a new set based on your drawing.
// --- FINAL VERSION, REBUILT FROM YOUR VISUAL DEBUGGING ---
// All previous coordinates have been discarded. This is a new set based on your drawing.
// --- NEW VERSION WITH AGGRESSIVE COORDINATE CHANGES ---
// These values have been significantly altered to move hotspots to their correct anatomical locations.
const muscleHotspotConfig = {
  1: { // Chest
    styles: [{ top: '20%', left: '33%', width: '32%', height: '10%' }],
    highlight: chestHighlight,
    view: 'front'
  },
  2: { // Back
    styles: [{ top: '17%', left: '36%', width: '30%', height: '26%' }],
    highlight: backHighlight,
    view: 'back'
  },
  3: { // Core
    styles: [{ top: '30%', left: '41%', width: '15%', height: '18%' }],
    highlight: coreHighlight,
    view: 'front'
  },
  4: { // Shoulders
    styles: [
      { top: '18%', left: '22%', width: '14%', height: '9%' }, // Left
      { top: '18%', left: '61%', width: '14%', height: '9%' }  // Right
    ],
    highlight: shoulderHighlight,
    view: 'front'
  },
  5: { // Biceps
    styles: [
      { top: '22%', left: '21%', width: '10%', height: '14%' }, // Left
      { top: '22%', left: '67%', width: '10%', height: '14%' }  // Right
    ],
    highlight: bicepsHighlight,
    view: 'front'
  },
  6: { // Triceps
    styles: [
      { top: '27%', left: '22%', width: '10%', height: '14%' },
      { top: '27%', left: '71%', width: '10%', height: '14%' }
    ],
    highlight: tricepsHighlight,
    view: 'back'
  },
 7: { // Quads
    styles: [
      { top: '53%', left: '39%', width: '10%', height: '21%' }, // Left Quad
      { top: '53%', left: '51%', width: '10%', height: '21%' }  // Right Quad
    ],
    highlight: quadsHighlight,
    view: 'front'
},

    8: { // Hamstrings
    styles: [
      { top: '54%', left: '38%', width: '10%', height: '18%' }, // Left Hamstring
      { top: '54%', left: '54%', width: '10%', height: '18%' }  // Right Hamstring
    ],
    highlight: hamstringsHighlight,
    view: 'back'
  },
  9: { // Calves
    styles: [
      { top: '73%', left: '37%', width: '11%', height: '9%' }, // Left Calf
      { top: '73%', left: '54%', width: '11%', height: '9%' }  // Right Calf
    ],
    highlight: calvesHighlight,
    view: 'back'
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


function MuscleDiagram({ isShowingFront, workedOutMuscles, handleMuscleClick, muscleGroups }) {
  return (
    <div className="diagram-container">
      <img
        src={isShowingFront ? frontViewImage : backViewImage}
        alt="Muscle diagram"
        className="muscle-diagram"
      />

      {/* Renders the correctly cropped highlight images */}
      {muscleGroups.map(muscle => {
        const config = muscleHotspotConfig[muscle.id];
        if (config && workedOutMuscles[muscle.id] && (config.view === 'front' ? isShowingFront : !isShowingFront)) {
          return (
            <img
              key={`highlight-${muscle.id}`}
              src={config.highlight}
              alt={`${muscle.name} highlight`}
              className="highlight-overlay"
              style={highlightOverlayStyle}
            />
          );
        }
        return null;
      })}

      {/* Renders the clickable hotspot buttons */}
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
    </div>
  );
}

export default MuscleDiagram;
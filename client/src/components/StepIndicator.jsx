import './StepIndicator.css';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="steps">
      {steps.map((step, i) => (
        <div key={i} className={`step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
          <div className="step-circle">{i < current ? '✓' : i + 1}</div>
          <span className="step-label">{step}</span>
          {i < steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

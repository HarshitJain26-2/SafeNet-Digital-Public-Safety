import { useParams } from 'react-router-dom';

export default function ScreenPage({ screens }) {
  const { '*': splat } = useParams();
  const screen = screens.find((s) => s.path === splat);

  if (!screen) {
    return (
      <div className="screen-page-empty">
        <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>error_outline</span>
        <h3>Module Not Found</h3>
        <p>The requested intelligence module could not be located.</p>
      </div>
    );
  }

  return (
    <div className="screen-page">
      <iframe
        className="screen-page-iframe"
        src={`/screens/${screen.filename}`}
        title={screen.title}
      />
    </div>
  );
}

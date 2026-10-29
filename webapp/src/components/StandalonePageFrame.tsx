import type { ComponentChildren } from 'preact';

interface StandalonePageFrameProps {
  title: string;
  eyebrow?: ComponentChildren;
  titleAccessory?: ComponentChildren;
  children: ComponentChildren;
}

export default function StandalonePageFrame(props: StandalonePageFrameProps) {
  return (
    <div className="standalone-shell">
      <div className="standalone-brand standalone-brand-outside">
        <img src="/nodewarden-logo.svg" alt="Jowarden logo" className="standalone-brand-logo" />
        <div>
          <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em' }}>Jowarden</span>
        </div>
      </div>

      <div className="auth-card">
        {props.eyebrow && <div className="standalone-eyebrow">{props.eyebrow}</div>}
        <div className="standalone-title-row">
          <h1 className="standalone-title">{props.title}</h1>
          {props.titleAccessory}
        </div>
        {props.children}
      </div>

      <div className="standalone-footer">
        <a href="https://github.com/johnny-official/jowarden" target="_blank" rel="noreferrer">Jowarden</a>
      </div>
    </div>
  );
}

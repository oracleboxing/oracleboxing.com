'use client'

export default function ButtonLibraryPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        h1 {
          color: #fef9c3;
          text-align: center;
          margin-bottom: 20px;
          font-size: 2.5rem;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          margin-bottom: 50px;
          font-size: 1.1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .variation-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(254, 249, 195, 0.2);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }

        .variation-title {
          color: #fef9c3;
          font-size: 1.2rem;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .code-badge {
          display: inline-block;
          background: rgba(254, 249, 195, 0.2);
          color: #fef9c3;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-left: 10px;
          font-family: 'Courier New', monospace;
        }

        .variation-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: stretch;
        }

        .button-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Base button styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.85rem 1.8rem;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        /* BUTTON GP-BYG: Black bg, Yellow text */
        .btn-gp-byg-primary {
          background: #000000;
          color: #fef9c3;
          border: 2px solid #fef9c3;
          box-shadow: 0 0 20px rgba(254, 249, 195, 0.4);
          animation: pulse-glow-byg 2s ease-in-out infinite;
        }

        .btn-gp-byg-primary:hover {
          background: #fef9c3;
          color: #000000;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(254, 249, 195, 0.6);
        }

        .btn-gp-byg-secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
          animation: pulse-glow-white-byg 2s ease-in-out infinite;
        }

        .btn-gp-byg-secondary:hover {
          background: #ffffff;
          color: #000000;
          transform: scale(1.05);
        }

        @keyframes pulse-glow-byg {
          0%, 100% { box-shadow: 0 0 20px rgba(254, 249, 195, 0.4); }
          50% { box-shadow: 0 0 30px rgba(254, 249, 195, 0.7); }
        }

        @keyframes pulse-glow-white-byg {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
        }

        /* BUTTON GP-WBG: White bg, Black text */
        .btn-gp-wbg-primary {
          background: #ffffff;
          color: #000000;
          border: 2px solid #000000;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          animation: pulse-glow-wbg 2s ease-in-out infinite;
        }

        .btn-gp-wbg-primary:hover {
          background: #000000;
          color: #ffffff;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .btn-gp-wbg-secondary {
          background: transparent;
          color: #000000;
          border: 2px solid #000000;
          animation: pulse-glow-black-wbg 2s ease-in-out infinite;
        }

        .btn-gp-wbg-secondary:hover {
          background: #000000;
          color: #ffffff;
          transform: scale(1.05);
        }

        @keyframes pulse-glow-wbg {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(0, 0, 0, 0.5); }
        }

        @keyframes pulse-glow-black-wbg {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 0 30px rgba(0, 0, 0, 0.4); }
        }

        /* BUTTON GP-YBG: Yellow bg, Black text */
        .btn-gp-ybg-primary {
          background: #fef9c3;
          color: #000000;
          border: 2px solid #000000;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          animation: pulse-glow-ybg 2s ease-in-out infinite;
        }

        .btn-gp-ybg-primary:hover {
          background: #000000;
          color: #fef9c3;
          border-color: #fef9c3;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(254, 249, 195, 0.6);
        }

        .btn-gp-ybg-secondary {
          background: transparent;
          color: #000000;
          border: 2px solid #000000;
          animation: pulse-glow-black-ybg 2s ease-in-out infinite;
        }

        .btn-gp-ybg-secondary:hover {
          background: #000000;
          color: #fef9c3;
          transform: scale(1.05);
        }

        @keyframes pulse-glow-ybg {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(0, 0, 0, 0.5); }
        }

        @keyframes pulse-glow-black-ybg {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 0 30px rgba(0, 0, 0, 0.4); }
        }

        /* BUTTON GP-TRY: Transparent bg, Yellow text + border */
        .btn-gp-try-primary {
          background: transparent;
          color: #fef9c3;
          border: 2px solid #fef9c3;
          box-shadow: 0 0 20px rgba(254, 249, 195, 0.4);
          animation: pulse-glow-try 2s ease-in-out infinite;
        }

        .btn-gp-try-primary:hover {
          background: #fef9c3;
          color: #000000;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(254, 249, 195, 0.6);
        }

        .btn-gp-try-secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
          animation: pulse-glow-white-try 2s ease-in-out infinite;
        }

        .btn-gp-try-secondary:hover {
          background: #ffffff;
          color: #000000;
          transform: scale(1.05);
        }

        @keyframes pulse-glow-try {
          0%, 100% { box-shadow: 0 0 20px rgba(254, 249, 195, 0.4); }
          50% { box-shadow: 0 0 30px rgba(254, 249, 195, 0.7); }
        }

        @keyframes pulse-glow-white-try {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 1.8rem;
          }

          .btn {
            font-size: 0.9rem;
            padding: 0.75rem 1.5rem;
          }
        }
      `}</style>

      <div className="container">
        <h1>Button Style Library</h1>
        <p className="subtitle">Reference guide for button styles across the Oracle Boxing website</p>

        <div className="grid">
          {/* Button GP-BYG-P */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-BYG-P</span>
            </h2>
            <p className="variation-description">Primary: Black bg, Yellow text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-byg-primary">GP-BYG-P</button>
            </div>
          </div>

          {/* Button GP-BYG-S */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-BYG-S</span>
            </h2>
            <p className="variation-description">Secondary: Transparent bg, White text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-byg-secondary">GP-BYG-S</button>
            </div>
          </div>

          {/* Button GP-WBG-P */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-WBG-P</span>
            </h2>
            <p className="variation-description">Primary: White bg, Black text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-wbg-primary">GP-WBG-P</button>
            </div>
          </div>

          {/* Button GP-WBG-S */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-WBG-S</span>
            </h2>
            <p className="variation-description">Secondary: Transparent bg, Black text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-wbg-secondary">GP-WBG-S</button>
            </div>
          </div>

          {/* Button GP-YBG-P */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-YBG-P</span>
            </h2>
            <p className="variation-description">Primary: Yellow bg, Black text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-ybg-primary">GP-YBG-P</button>
            </div>
          </div>

          {/* Button GP-YBG-S */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-YBG-S</span>
            </h2>
            <p className="variation-description">Secondary: Transparent bg, Black text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-ybg-secondary">GP-YBG-S</button>
            </div>
          </div>

          {/* Button GP-TRY-P */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-TRY-P</span>
            </h2>
            <p className="variation-description">Primary: Transparent bg, Yellow text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-try-primary">GP-TRY-P</button>
            </div>
          </div>

          {/* Button GP-TRY-S */}
          <div className="variation-card">
            <h2 className="variation-title">
              <span className="code-badge">GP-TRY-S</span>
            </h2>
            <p className="variation-description">Secondary: Transparent bg, White text/border with glow pulse</p>
            <div className="button-container">
              <button className="btn btn-gp-try-secondary">GP-TRY-S</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

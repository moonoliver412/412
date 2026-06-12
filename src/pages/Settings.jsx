import { useRef, useState } from 'react';
import { useSettings } from '../state/useSettings';
import { useGame } from '../state/useGame';
import { canAskPermission, notificationsEnabled } from '../lib/notify';
import { downloadBundle, importBundle } from '../lib/saveFile';
import {
  ageAllowsAccount,
  claimAccount,
  cloudEnabled,
  pullAndMerge,
  pushSave,
} from '../lib/cloudSync';
import { play } from '../lib/sound';
import './Settings.css';

// Settings — sound, reminders, motion, and your data (export/import/reset).

function Row({ title, blurb, children }) {
  return (
    <div className="set-row">
      <div className="set-row-text">
        <h3 className="set-row-title">{title}</h3>
        <p className="set-row-blurb">{blurb}</p>
      </div>
      <div className="set-row-control">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { settings, update } = useSettings();
  const { game } = useGame();
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const say = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 3500);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importBundle(String(reader.result));
        window.location.reload();
      } catch {
        say("That file isn't a CodeSprout save.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset ALL CodeSprout data — forest, sprouts, streak, everything? This cannot be undone.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <main className="cs-page settings">
      <h1 className="cs-page-title">Settings</h1>

      <section className="cs-panel set-panel set-rise" style={{ '--i': 0 }}>
        <h2 className="cs-panel-title set-panel-title">Experience</h2>

        <Row
          title="Sound"
          blurb="Little chimes when checks pass, lessons finish, and chests open."
        >
          <button
            type="button"
            role="switch"
            aria-checked={settings.sound}
            className={`set-toggle${settings.sound ? ' is-on' : ''}`}
            onClick={() => {
              const next = !settings.sound;
              update({ sound: next });
              if (next) setTimeout(() => play('check'), 50);
            }}
          >
            <span className="set-toggle-knob" />
          </button>
        </Row>

        <Row
          title="Calm motion"
          blurb="Turn off animations if movement is distracting. 'Auto' follows your device setting."
        >
          <div className="set-seg" role="group" aria-label="Motion">
            {['auto', 'reduced'].map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={settings.motion === mode}
                className={`set-seg-btn${
                  settings.motion === mode ? ' is-active' : ''
                }`}
                onClick={() => update({ motion: mode })}
              >
                {mode === 'auto' ? 'Auto' : 'Calm'}
              </button>
            ))}
          </div>
        </Row>

        <Row
          title="Streak reminders"
          blurb={
            notificationsEnabled()
              ? "On. We'll nudge you in the evening if your streak is about to end."
              : 'Get a heads-up in the evening when your streak is about to end.'
          }
        >
          {notifPermission === 'granted' ? (
            <span className="set-status-chip is-on">On</span>
          ) : notifPermission === 'denied' && !canAskPermission() ? (
            <span className="set-status-chip">Blocked in browser</span>
          ) : (
            <button
              type="button"
              className="cs-pill-btn set-small-btn"
              onClick={async () => {
                const p = await Notification.requestPermission();
                setNotifPermission(p);
              }}
            >
              Turn on
            </button>
          )}
        </Row>
      </section>

      <section className="cs-panel set-panel set-rise" style={{ '--i': 1 }}>
        <h2 className="cs-panel-title set-panel-title">Your data</h2>
        <p className="set-data-note">
          Everything lives in this browser — {game.sprouts} sprouts,{' '}
          {game.streak.longest}-day best streak and all. Download a save file
          to back it up or move to another device.
        </p>

        <div className="set-data-actions">
          <button
            type="button"
            className="cs-pill-btn cs-pill-btn--orange set-small-btn"
            onClick={() => {
              downloadBundle();
              say('Save file downloaded.');
            }}
          >
            Download save file
          </button>
          <button
            type="button"
            className="cs-pill-btn set-small-btn"
            onClick={() => fileRef.current?.click()}
          >
            Load save file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImport}
          />
          <button
            type="button"
            className="set-danger-btn"
            onClick={handleReset}
          >
            Reset everything
          </button>
        </div>
        {status && (
          <p className="set-status" role="status">
            {status}
          </p>
        )}
      </section>

      <section className="cs-panel set-panel set-rise" style={{ '--i': 2 }}>
        <h2 className="cs-panel-title set-panel-title">Cloud sync</h2>
        {cloudEnabled ? (
          <CloudSection say={say} />
        ) : (
          <p className="set-data-note">
            Cloud sync and the live league switch on when this app is
            connected to its backend (see <code>supabase/schema.sql</code>).
            Until then, your save-file download above is your backup.
          </p>
        )}
      </section>
    </main>
  );
}

// Cloud sync controls (only rendered when the backend is configured).
// Anonymous-first: syncing never asks for personal info; claiming an
// account runs the neutral age screen first and blocks under-13 (COPPA).
function CloudSection({ say }) {
  const [busy, setBusy] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [email, setEmail] = useState('');

  const run = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      say(okMsg);
    } catch (err) {
      say(err.message ?? 'Something went wrong — try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <p className="set-data-note">
        Back your forest up to the cloud and move between devices. Syncing is
        anonymous — no name, no email, nothing personal.
      </p>
      <div className="set-data-actions">
        <button
          type="button"
          className="cs-pill-btn cs-pill-btn--orange set-small-btn"
          disabled={busy}
          onClick={() => run(pushSave, 'Forest synced to the cloud.')}
        >
          Sync my forest
        </button>
        <button
          type="button"
          className="cs-pill-btn set-small-btn"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const found = await pullAndMerge();
              if (found) window.location.reload();
              else say('No cloud save yet — sync first.');
            }, 'Merged the cloud save.')
          }
        >
          Pull from cloud
        </button>
      </div>

      <div className="set-claim">
        <p className="set-data-note">
          Add an email so you can sign in on any device. You need to be 13 or
          older.
        </p>
        <div className="set-data-actions">
          <input
            className="set-input"
            type="number"
            inputMode="numeric"
            placeholder="Birth year"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            aria-label="Birth year"
          />
          <input
            className="set-input set-input--email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
          <button
            type="button"
            className="cs-pill-btn set-small-btn"
            disabled={busy || !email || !ageAllowsAccount(Number(birthYear))}
            onClick={() =>
              run(
                () => claimAccount(email, Number(birthYear)),
                'Check your inbox to confirm your email.'
              )
            }
          >
            Claim account
          </button>
        </div>
      </div>
    </>
  );
}

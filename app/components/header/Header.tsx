import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="flex items-center logo-link">
          {/* Convigas-Code Logo - Light Mode */}
          <svg viewBox="0 0 280 50" width="220" height="42" className="dark:hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="redGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
            <text
              x="5"
              y="32"
              fontFamily="'Orbitron', 'Segoe UI', system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="#1a1a2e"
              letterSpacing="0.5"
              fontStyle="italic"
            >
              Convigas-
            </text>
            <text
              x="148"
              y="32"
              fontFamily="'Orbitron', 'Segoe UI', system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="url(#redGradLight)"
              letterSpacing="0.5"
              fontStyle="italic"
            >
              Code
            </text>
            <path d="M 5 40 L 235 40" stroke="#EF4444" strokeWidth="2" opacity="0.6" />
            <path d="M 235 40 L 230 38 M 235 40 L 230 42" stroke="#EF4444" strokeWidth="2" opacity="0.6" />
          </svg>
          {/* Convigas-Code Logo - Dark Mode */}
          <svg
            viewBox="0 0 280 50"
            width="220"
            height="42"
            className="hidden dark:block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="redGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="50%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
            <text
              x="5"
              y="32"
              fontFamily="'Orbitron', 'Segoe UI', system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="#ffffff"
              letterSpacing="0.5"
              fontStyle="italic"
            >
              Convigas-
            </text>
            <text
              x="148"
              y="32"
              fontFamily="'Orbitron', 'Segoe UI', system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="url(#redGradDark)"
              letterSpacing="0.5"
              fontStyle="italic"
            >
              Code
            </text>
            <path d="M 5 40 L 235 40" stroke="#F87171" strokeWidth="2" opacity="0.8" />
            <path d="M 235 40 L 230 38 M 235 40 L 230 42" stroke="#F87171" strokeWidth="2" opacity="0.8" />
          </svg>
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}

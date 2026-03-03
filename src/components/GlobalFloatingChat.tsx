import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ChatWidget } from "./ChatWidget";
import { FloatingChatButton } from "./FloatingChatButton";

export const GLOBAL_CHAT_OPEN_EVENT = "kufu:global-chat-open";

function shouldHideGlobalChat(pathname: string): boolean {
  // Avoid rendering the global launcher inside the dedicated widget page.
  return pathname.startsWith("/widget");
}

export function GlobalFloatingChat() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const hideChat = shouldHideGlobalChat(location.pathname);

  useEffect(() => {
    if (hideChat) {
      setChatOpen(false);
    }
  }, [hideChat]);

  useEffect(() => {
    const handleOpenRequest = () => {
      setChatOpen(true);
    };

    window.addEventListener(GLOBAL_CHAT_OPEN_EVENT, handleOpenRequest);
    return () => {
      window.removeEventListener(GLOBAL_CHAT_OPEN_EVENT, handleOpenRequest);
    };
  }, []);

  if (hideChat) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {chatOpen ? (
          <motion.div
            id="floating-chat-widget"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatWidget mode="floating" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FloatingChatButton
        isOpen={chatOpen}
        onToggle={() => setChatOpen((current) => !current)}
      />
    </div>
  );
}

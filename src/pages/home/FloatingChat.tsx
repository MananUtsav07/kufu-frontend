import { AnimatePresence, motion } from "framer-motion";
import { ChatWidget } from "../../components/ChatWidget";
import { FloatingChatButton } from "../../components/FloatingChatButton";

type FloatingChatProps = {
  chatOpen: boolean;
  onToggle: () => void;
};

export function FloatingChat({ chatOpen, onToggle }: FloatingChatProps) {
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

      <FloatingChatButton isOpen={chatOpen} onToggle={onToggle} />
    </div>
  );
}

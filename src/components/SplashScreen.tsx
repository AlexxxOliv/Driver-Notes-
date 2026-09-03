import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
  autoCloseDelay?: number; // ms, default 2000
  isReplay?: boolean;
  onClose?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  autoCloseDelay = 2200,
  isReplay = false,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      if (onFinish) onFinish();
      if (onClose) onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black px-6 py-12 select-none cursor-pointer overflow-hidden"
        >
          {/* Top spacer */}
          <div className="w-full flex justify-end">
            {isReplay && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/20 transition"
              >
                Pular
              </button>
            )}
          </div>

          {/* Centered Pixel Logo - Faithful to Carregamento.jpg */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center my-auto w-full max-w-sm"
          >
            <svg
              viewBox="0 0 380 200"
              className="w-full max-w-[340px] drop-shadow-[0_0_25px_rgba(220,38,38,0.25)]"
            >
              <defs>
                {/* Checker / Dot pattern for the NOTES blue letters */}
                <pattern id="pixelDots" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="3" height="3" fill="#00609c" />
                  <rect x="3" width="3" height="3" fill="#00a2ff" />
                  <rect y="3" width="3" height="3" fill="#00a2ff" />
                  <rect x="3" y="3" width="3" height="3" fill="#00609c" />
                </pattern>
                <pattern id="checkeredFine" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="2" height="2" fill="#0284c7" />
                  <rect x="2" y="2" width="2" height="2" fill="#0284c7" />
                  <rect x="2" width="2" height="2" fill="#38bdf8" />
                  <rect y="2" width="2" height="2" fill="#38bdf8" />
                </pattern>
                <pattern id="redChecks" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="3" height="3" fill="#991b1b" />
                  <rect x="3" width="3" height="3" fill="#b91c1c" />
                  <rect y="3" width="3" height="3" fill="#b91c1c" />
                  <rect x="3" y="3" width="3" height="3" fill="#7f1d1d" />
                </pattern>
              </defs>

              {/* ================= DRIVER (RED PIXEL BLOCKS) ================= */}
              <g id="driver-word" fill="#b91c1c" stroke="#991b1b" strokeWidth="1">
                {/* Letter D */}
                {/* Vertical bar */}
                <rect x="20" y="20" width="16" height="68" fill="#b91c1c" />
                {/* Top bar */}
                <rect x="36" y="20" width="20" height="16" fill="#b91c1c" />
                {/* Right angle */}
                <polygon points="56,20 68,32 68,76 56,88 56,72 56,36" fill="#b91c1c" />
                {/* Bottom bar */}
                <rect x="36" y="72" width="20" height="16" fill="#b91c1c" />
                {/* Hole cut */}
                <rect x="36" y="36" width="18" height="36" fill="#000000" stroke="none" />

                {/* Letter R */}
                <g transform="translate(62, 0)">
                  <rect x="20" y="20" width="16" height="68" fill="#c51818" />
                  <rect x="36" y="20" width="18" height="16" fill="#c51818" />
                  <rect x="54" y="20" width="14" height="36" fill="#c51818" />
                  <rect x="36" y="44" width="18" height="14" fill="#c51818" />
                  <polygon points="36,58 52,58 68,88 50,88" fill="#c51818" />
                  {/* R inner hole */}
                  <rect x="36" y="32" width="14" height="14" fill="#000000" stroke="none" />
                </g>

                {/* Letter I */}
                <g transform="translate(122, 0)">
                  <rect x="20" y="20" width="16" height="68" fill="#c51818" />
                </g>

                {/* Letter V */}
                <g transform="translate(148, 0)">
                  <polygon points="20,20 36,20 48,72 48,88 38,88" fill="url(#redChecks)" />
                  <polygon points="68,20 52,20 40,72 40,88 50,88" fill="#b91c1c" />
                </g>

                {/* Letter E */}
                <g transform="translate(208, 0)">
                  <rect x="20" y="20" width="16" height="68" fill="#c51818" />
                  <rect x="36" y="20" width="30" height="15" fill="#c51818" />
                  <rect x="36" y="46" width="24" height="14" fill="#c51818" />
                  <rect x="36" y="73" width="30" height="15" fill="#c51818" />
                </g>

                {/* Letter R */}
                <g transform="translate(266, 0)">
                  <rect x="20" y="20" width="16" height="68" fill="#c51818" />
                  <rect x="36" y="20" width="18" height="16" fill="#c51818" />
                  <rect x="54" y="20" width="14" height="36" fill="#c51818" />
                  <rect x="36" y="44" width="18" height="14" fill="#c51818" />
                  <polygon points="36,58 52,58 68,88 50,88" fill="#c51818" />
                  <rect x="36" y="32" width="14" height="14" fill="#000000" stroke="none" />
                </g>
              </g>

              {/* ================= NOTES (CYAN / BLUE PIXEL BLOCKS) ================= */}
              <g id="notes-word" fill="#00a2ff">
                {/* Letter N */}
                <g transform="translate(56, 100)">
                  <rect x="20" y="0" width="16" height="68" fill="#00a2ff" />
                  <polygon points="36,0 48,0 60,68 48,68" fill="url(#pixelDots)" />
                  <rect x="56" y="0" width="16" height="68" fill="#00a2ff" />
                </g>

                {/* Letter O */}
                <g transform="translate(122, 100)">
                  <rect x="20" y="0" width="46" height="68" fill="#00a2ff" />
                  {/* Cutout center */}
                  <rect x="34" y="16" width="18" height="36" fill="#000000" />
                  {/* Texture inside O corners */}
                  <rect x="20" y="16" width="14" height="36" fill="url(#pixelDots)" />
                </g>

                {/* Letter T */}
                <g transform="translate(180, 100)">
                  <rect x="16" y="0" width="48" height="16" fill="#00a2ff" />
                  <rect x="32" y="16" width="16" height="52" fill="url(#checkeredFine)" />
                  <rect x="32" y="16" width="16" height="52" fill="#00a2ff" opacity="0.7" />
                </g>

                {/* Letter E */}
                <g transform="translate(236, 100)">
                  <rect x="20" y="0" width="16" height="68" fill="#00a2ff" />
                  <rect x="36" y="0" width="28" height="15" fill="#00a2ff" />
                  <rect x="36" y="26" width="22" height="14" fill="url(#pixelDots)" />
                  <rect x="36" y="53" width="28" height="15" fill="#00a2ff" />
                </g>

                {/* Letter S */}
                <g transform="translate(288, 100)">
                  <rect x="20" y="0" width="42" height="15" fill="#00a2ff" />
                  <rect x="20" y="15" width="16" height="18" fill="#00a2ff" />
                  <rect x="20" y="27" width="42" height="15" fill="#00a2ff" />
                  <rect x="46" y="38" width="16" height="18" fill="#00a2ff" />
                  <rect x="20" y="53" width="42" height="15" fill="#00a2ff" />
                </g>
              </g>
            </svg>

            {/* Subtle loading pulse bar */}
            <div className="w-24 h-0.5 bg-slate-900 rounded-full mt-8 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-red-600 via-sky-500 to-red-600"
              />
            </div>
          </motion.div>

          {/* Bottom "by ALEX" - Centered, tracking wide, matching Carregamento.jpg */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center pb-6"
          >
            <p className="text-xs sm:text-sm font-sans tracking-[0.35em] text-slate-100 font-normal uppercase">
              by ALEX
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

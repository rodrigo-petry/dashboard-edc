import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface MotionPageWrapperProps {
  children: ReactNode;
}

function MotionPageWrapper({ children }: MotionPageWrapperProps) {
  const router = useRouter();

  return (
    <motion.div
      key={router.route}
      initial="pageInitial"
      animate="pageAnimate"
      variants={{
        pageInitial: {
          opacity: 0,
        },
        pageAnimate: {
          opacity: 1,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default MotionPageWrapper;

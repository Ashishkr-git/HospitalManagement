import * as React from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

interface AlertDialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertDialogContext = React.createContext<
  AlertDialogContextType | undefined
>(undefined);

interface AlertDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      if (onOpenChange) {
        const newValue = typeof value === "function" ? value(open) : value;
        onOpenChange(newValue);
      }
    },
    [isControlled, onOpenChange, open]
  );

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, asChild = false, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialogTrigger must be used within an AlertDialog");
  }

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);

    // Call the original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };

  // Remove onClick from props to avoid duplicate handlers
  const { onClick, ...otherProps } = props;

  if (asChild) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              ref,
              onClick: handleClick,
            });
          }
          return child;
        })}
      </>
    );
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} {...otherProps}>
      {children}
    </button>
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogPortal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

const AlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialogOverlay must be used within an AlertDialog");
  }

  const { open } = context;

  // It's less likely for AlertDialogOverlay to have conflicting props,
  // but if the error points here, apply the same filtering.
  // For now, we'll assume the primary issue is in AlertDialogContent.
  return (
    <AnimatePresence>
      {open && (
        <div
          ref={ref}
          className={cn("fixed inset-0 z-50 bg-black/80", className)}
          {...props}
        />
      )}
    </AnimatePresence>
  );
});
const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialogContent must be used within an AlertDialog");
  }

  const { open, setOpen } = context;

  // Click outside logic
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <motion.div
            ref={(node) => {
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
              (
                contentRef as React.MutableRefObject<HTMLDivElement | null>
              ).current = node;
            }}
            // FORCE CENTER using !important classes
            className={cn(
              "fixed! left-1/2! top-1/2! z-50! grid! w-[90%]! max-w-lg! -translate-x-1/2! -translate-y-1/2! gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full",
              className
            )}
            // REMOVED 'x' and 'y' from animation to stop the conflict
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            {...Object.keys(props).reduce(
              (acc: { [key: string]: any }, key) => {
                if (
                  key === "onDrag" ||
                  key === "onAnimationStart" ||
                  key === "onTransitionEnd"
                )
                  return acc;
                acc[key] = (props as any)[key];
                return acc;
              },
              {}
            )}
          >
            {children}
          </motion.div>
        </AlertDialogPortal>
      )}
    </AnimatePresence>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(({ className, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialogAction must be used within an AlertDialog");
  }

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);

    // Call the original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };

  // Remove onClick from props to avoid duplicate handlers
  const { onClick, ...otherProps } = props;

  return (
    <button
      ref={ref}
      className={cn(buttonVariants(), className)}
      onClick={handleClick}
      {...otherProps}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialogCancel must be used within an AlertDialog");
  }

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);

    // Call the original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };

  // Remove onClick from props to avoid duplicate handlers
  const { onClick, ...otherProps } = props;

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={handleClick}
      {...otherProps}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

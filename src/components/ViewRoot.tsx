import { PropsWithChildren } from "react";

import { SpeechProvider, ModalProvider } from ".";

export function ViewRoot({ children }: PropsWithChildren) {
  return (
    <SpeechProvider>
      <ModalProvider>
        <div className="m-0 h-full flex flex-col">{children}</div>
      </ModalProvider>
    </SpeechProvider>
  );
}

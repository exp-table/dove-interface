import Main from "../components/layouts/Main";
import Article from "../components/layouts/Article";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect, useRef } from "react";
import { chain, useNetwork, useSwitchNetwork } from "wagmi";
import { useIsMounted } from "../lib/hooks/useIsMounted";
import { BiCog } from "react-icons/bi";
import TabContainer from "../components/TabContainer";
import SwapTabContent from "../components/SwapTabContent";
import DammTabContent from "../components/DammTabContent";
import SettingsTabContent from "../components/SettingsTabContent";
import { GiPeaceDove } from "react-icons/gi";
import { useUserStore } from "../state/user/useUserStore";
import { ChainId } from "../sdk";
import UnsupportedNetworkContent from "../components/UnsupportedNetworkContent";

export default function Home() {
  const isAutoSwitch = useUserStore((state) => state.isAutoSwitch);
  const [activeNetworkTab, setActiveNetworkTab] = useState("damm");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const { chain: currentChain } = useNetwork();

  useEffect(() => {
    if (isAutoSwitch) {
      if (activeNetworkTab === "damm") {
        switchNetwork?.(chain.goerli.id);
      }
    }
  }, [activeNetworkTab]);

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const isSupportedNetwork = currentChain
    ? Object.values(ChainId).includes(currentChain.id) &&
      currentChain.id !== ChainId.ETHEREUM_GOERLI
    : false;

  return (
    <Main>
      <Article>
        <div className="radial absolute h-screen w-full"></div>
        <div className="background-gradient absolute h-full w-[100vw] opacity-20">
          <div className="background-gradient-pattern" />
        </div>
        <div className="relative flex min-h-screen w-full flex-col items-start justify-start pb-36 pt-36">
          <div className="relative mb-4 flex w-full flex-col items-start">
            <div className="flex w-full flex-row space-x-4">
              <Tabs.Root
                value={activeNetworkTab}
                onValueChange={(v) => setActiveNetworkTab(v)}
                defaultValue="damm"
                className="w-full"
              >
                <Tabs.List className="relative z-10 flex flex-row">
                  <Tabs.Trigger
                    value="amm"
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "amm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/5" />
                    )}
                    <p className="font-normal">AMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="damm"
                    className="relative w-full cursor-pointer overflow-hidden rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    {activeNetworkTab === "damm" && (
                      <GiPeaceDove className="absolute right-0 -rotate-45 text-6xl text-white/5" />
                    )}
                    <p className="font-normal">dAMM</p>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="settings"
                    className="w-12 cursor-pointer rounded-sm rounded-b-none border border-b-0 border-white/5 bg-black/10 px-4 py-2 text-left transition duration-300 ease-linear hover:text-white focus:outline-none rdx-state-active:bg-[#313135] rdx-state-active:text-white rdx-state-inactive:text-white/50"
                  >
                    <BiCog className="" />
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="damm">
                  <TabContainer>
                    <DammTabContent />
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="amm">
                  <TabContainer>
                    {isSupportedNetwork ? (
                      <SwapTabContent />
                    ) : (
                      <UnsupportedNetworkContent />
                    )}
                  </TabContainer>
                </Tabs.Content>
                <Tabs.Content value="settings">
                  <TabContainer>
                    <SettingsTabContent />
                  </TabContainer>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
          {/* <div className="flex w-full flex-col justify-end rounded-sm bg-black/10 px-4 py-1 outline outline-1 outline-offset-4 outline-sky-400">
            <p className="text-white">Need help?</p>
          </div> */}
        </div>
      </Article>
    </Main>
  );
}

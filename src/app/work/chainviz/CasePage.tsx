'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  const { setTheme } = useTheme()

  setTheme('dark')

  return (
    <main className="pb-10">

      {/* Header */}
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">

        {/* Menu */}
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/stars-honey" label="Previous" />
          <Button as="a" href="/work/shareio" label="Next" />
          <Button as="a" href="/work" label="Close" />
        </div>

        {/* Title */}
        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Chainviz</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>UI/UX</div>
          <div>Brand motion</div>
          <div>3D</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://github.com/helikon-labs/chainviz" label="Github" />
          <Button as="a" href="https://www.behance.net/gallery/186534927/Chainviz-Validators-Explorer" label="Behance" />
          <Button as="a" href="https://chainviz.app" label="App" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>W3F funded project to create a realtime WebGL Polkadot and Kusama valiadtor ecosystem visualisation, including parachain views and validator explorer.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>Created a brand concept suitable for a minimalistic data visualisation. Developed a 3D model to display the validator space. Assembled panel-based web app UI/UX.</p>
            </div>
          </div>
        </div>

        {/* Short information */}
        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">Turkey</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Web3 & Blockchain</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">19 weeks</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2022</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/1.avif" alt="Chainviz brand graphics poster" width={1720} height={1029} />
      </SectionMedia>

      <SectionText align="right">
        <p>This project explores blockchain validator infrastructure through a real-time, 3D navigable interface designed for the Polkadot and Kusama ecosystems. At the core of the visual identity is a dynamic logo that adapts in form and reflects the interdependence of nodes within a living network. This idea extends into a cohesive visual system where dots, arcs, and data-driven motion represent validators and their relationships, creating a consistent language that connects branding, interface, and data visualization.</p>
        <p>The design centers around a spatial validator sphere built from interwoven arcs, where each dot represents an active participant in the network. Scale, grouping, and positioning communicate parameters, categories and activity at a glance, while a unified graphic style ensures clarity across graphs, UI components and navigation. Validators remain the visual and conceptual focal point, reinforcing their central role in block verification and overall infrastructure health.</p>
        <p>The interface translates complex blockchain processes into an interactive experience through precise hover interactions, and layered information states. From relay chain statistics to parachain relationships, the system maintains visual consistency across contexts and devices.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/2.avif" alt="Logo emphasises the interdependence of elements within the validator space through the dynamic information display" width={1720} height={1496} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/1570]" src="https://klad.b-cdn.net/chainviz/1_logo%20block%20animation_3.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionText title="A Living Mark for a Living Network" align="center">
        <p>At the core of the visual identity is a dynamic logo that adapts in form and reflects the interdependence of nodes within a living network. Rather than acting as a static symbol, it becomes a conceptual anchor for the entire system.</p>
        <p>This logic extends into a cohesive visual language built from dots, arcs, and data-driven motion that represent validators and their relationships. Together, these elements create a consistent bridge between branding, interface, and data visualization, ensuring that every part of the experience feels connected and rooted in the same structural idea.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[2800/1606]" src="https://klad.b-cdn.net/chainviz/3_blockchain%20rythm%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText align="right">
        <p>The design centers around a spatial validator sphere constructed from interwoven arcs, forming a clear and recognizable structure that represents the network as a living system. Each dot within this sphere corresponds to an active validator, turning abstract infrastructure into a tangible visual entity. Differences in size, position, and grouping help communicate key parameters at a glance, allowing users to quickly grasp activity, relationships, and distribution without needing to interpret raw data.</p>
        <p>This spherical composition becomes the visual and functional focal point of the interface. Arcs act as natural containers for categories and connections, while individual dots can be highlighted to signal participation in block validation or shifts in network dynamics.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/5.avif" alt="Graphic planes 3D model anatomy" width={1720} height={752} />
      </SectionMedia>

      <SectionText align="left">
        <p>By placing validators at the center of the visual experience, the design reinforces their importance and creates an intuitive mental model of how the ecosystem operates, transforming complexity into a structured, navigable form.</p>
        <p>The validator sphere also serves as a navigational map of the validator space, allowing users to explore the network as a structured environment rather than a flat dataset.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/6.avif" alt="Visualisation of the validator space" width={1720} height={1331} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/7.avif" alt="Contextual brand graphics for Chainviz" width={1720} height={1749} />
      </SectionMedia>

      <SectionText align="center">
        <p>Spatial logic turns the abstract concept of infrastructure into something users can visually scan and understand, reinforcing the sense of a connected, constantly evolving ecosystem.</p>
        <p>Within this space, focus can shift fluidly from the network as a whole to individual participants. Highlighted nodes surface key actors, while the surrounding arcs provide context about their role, grouping, and influence.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/8.avif" alt="3D visualisation of the validator space in light theme" width={1720} height={1878} />
      </SectionMedia>

      <SectionText align="right">
        <p>The UI is built around keeping this structure clear and readable at all times, allowing users to navigate the validator space without losing context. The sidebar consolidates navigation, key statistics, and filters into a single area, while the main screen gives prominence to the sphere and the data it represents. Whether viewing relay chain information or focusing on a specific parachain, the layout adapts to maintain the validator network as the central point of reference.</p>
        <p>Responsiveness plays a crucial role in preserving clarity across devices. The sphere, arcs and nodes scale and reorganize fluidly to fit different screen sizes. Interaction is designed for precision, hovering gently detaches nodes from their arcs, triggering subtle magnetic alignment and quick data previews, which can expand into detailed validator information on click. This layered approach keeps the interface lightweight while allowing deeper exploration when needed, making the complex validator space feel structured.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[2800/1578]" src="https://klad.b-cdn.net/chainviz/4_blockchain%20model%20preview%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/10.avif" alt="Mobile responsive UI design for the app Chainviz" width={1720} height={1146} />
      </SectionMedia>

      <SectionText align="left">
        <p>Parachains are presented as parallel layers within the validator space, helping users understand how multiple chains operate simultaneously within a single ecosystem. Instead of treating them as separate datasets, the UI integrates them into the same spatial logic as the relay chain, making their relationships immediately visible.</p>
        <p>Each parachain can be surfaced as its own structured grouping, where validators are visually distributed across arcs and clusters, allowing users to see how responsibility, activity, and coverage shift across the network.</p>
        <p>n the interface, switching to a parachain view refocuses the main screen on that chain’s data while preserving the overall spatial context. Validators connected to a selected parachain become more prominent, and their distribution reveals how validation is allocated across different parts of the ecosystem.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/11.avif" alt="Blockchain app visualisation preview" width={1720} height={1394} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/12.avif" alt="Parachains visualisation for Chainviz app" width={1720} height={2050} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/13.avif" alt="SParachains interconnected future of blockchains, where every chain plays pivotal role in a seamless digital ecosystem." width={1720} height={1468} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/14.avif" alt="Parachain view with use of sub-graphs in the app UI" width={1720} height={1133} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/2760]" src="https://klad.b-cdn.net/chainviz/5_means%20of%20ui%20animation_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/15.avif" alt="UI for selection and rich view of validators in Chainviz" width={1720} height={1192} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/1682]" src="https://klad.b-cdn.net/chainviz/6_validator%20hover%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText align="right">
        <p>The interface is designed to make blockchain-specific events legible, even for users who may not be deeply technical. Era changes in Polkadot and Kusama represent key transition moments when validator sets can shift, rewards are distributed, and penalties such as slashing may occur. In the UI, these moments are reflected through changes in the validator sphere.</p>
        <p>Rather than presenting these events as abstract logs, the system visualizes them as visible transitions within the network, helping users understand when and how structural changes take place.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[2800/2066]" src="https://klad.b-cdn.net/chainviz/7_load%20and%20era%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText align="center">
        <p>XCM messages are reflected in the interface as visible links between chains, helping users understand how communication flows across the ecosystem. Rather than remaining a hidden technical process, cross-chain activity is subtly indicated through connections and transitions within the validator space, reinforcing the idea of a network that is constantly exchanging data and value.</p>
        <p>A dedicated light theme offers a low-contrast alternative that reduces visual fatigue and shifts focus toward content and structure. The project also includes a set of conceptual merchandise that applies the same visual language of dots, arcs and motion into physical formats, reinforcing continuity across digital and tangible touchpoints.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/16.avif" alt="UI design for the XCM messages visualisation" width={1720} height={1263} />
      </SectionMedia>        

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/19.avif" alt="Light theme app UI design for Chainviz" width={1720} height={1152} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/20.avif" alt="Chainviz brand logo on hardware" width={1720} height={910} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/chainviz/21.avif" alt="Brand identity t-shirt design Chainviz" width={1720} height={1363} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/stars-honey" label="Previous" />
        <Button as="a" href="/work/shareio" label="Next" />
      </footer>
    </main>
  )
}

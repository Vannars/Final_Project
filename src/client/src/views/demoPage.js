import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const demoOptions = [
  {
    title: "Arctic Sea Ice Decline (Demo 1 2000 characters approx).",
    prompt: `Sea ice in the Arctic region has declined in recent decades in area and volume due to climate change. It has been melting more in summer than it refreezes in winter. Global warming, caused by greenhouse gas forcing is responsible for the decline in Arctic sea ice. The decline of sea ice in the Arctic has been accelerating during the early twenty-first century, with a decline rate of 4.7% per decade (it has declined over 50% since the first satellite records). Summertime sea ice will likely cease to exist sometime during the 21st century.

The region is at its warmest in at least 4,000 years. Furthermore, the Arctic-wide melt season has lengthened at a rate of five days per decade (from 1979 to 2013), dominated by a later autumn freeze-up. The IPCC Sixth Assessment Report (2021) stated that Arctic sea ice area will likely drop below 1 million km2 in at least some Septembers before 2050. In September 2020, the US National Snow and Ice Data Center reported that the Arctic sea ice in 2020 had melted to an extent of 3.74 million km2, its second-smallest extent since records began in 1979. Earth lost 28 trillion tonnes of ice between 1994 and 2017, with Arctic sea ice accounting for 7.6 trillion tonnes of this loss. The rate of ice loss has risen by 57% since the 1990s.

Sea ice loss is one of the main drivers of Arctic amplification, the phenomenon that the Arctic warms faster than the rest of the world under climate change. It is plausible that sea ice decline also makes the jet stream weaker, which would cause more persistent and extreme weather in mid-latitudes. Shipping is more often possible in the Arctic now, and will likely increase further. Both the disappearance of sea ice and the resulting possibility of more human activity in the Arctic Ocean pose a risk to local wildlife such as polar bears.

One important aspect in understanding sea ice decline is the Arctic dipole anomaly. This phenomenon appears to have slowed down the overall loss of sea ice between 2007 and 2021, but such a trend will probably not continue.`
  },
  {
    title: "Mind-Map Wiki (Demo 2 500 characters approx).",
    prompt: `A mind map is a diagram used to visually organize information into a hierarchy, showing relationships among pieces of the whole. It is often based on a single concept, drawn as an image in the center of a blank page, to which associated representations of ideas such as images, words and parts of words are added. Major ideas are connected directly to the central concept, and other ideas branch out from those major ideas.

Mind maps can also be drawn by hand, either as "notes" during a lecture, meeting or planning session, for example, or as higher quality pictures when more time is available. Mind maps are considered to be a type of spider diagram.`
  },
  {
    title: "The Aurora Borealis (Demo 3, 3500 characters approx).",
    prompt: `The aurora can be seen near the poles of both the northern and southern hemisphere. In the north the display is known as the aurora borealis; in the south it is called the aurora australis.
These 'northern' and 'southern lights' have fascinated, frightened and inspired humans for centuries. More recently, photographers have gone to remarkable lengths to try and capture the beauty of these atmospheric events.
The lights we see in the night sky are in actual fact caused by activity on the surface of the Sun.
Solar storms on our star's surface give out huge clouds of electrically charged particles. These particles can travel millions of miles, and some may eventually collide with the Earth.
Most of these particles are deflected away, but some become captured in the Earth’s magnetic field, accelerating down towards the north and south poles into the atmosphere. This is why aurora activity is concentrated at the magnetic poles.
'These particles then slam into atoms and molecules in the Earth’s atmosphere and essentially heat them up,' explains Royal Observatory astronomer Tom Kerss. 'We call this physical process ‘excitation’, but it’s very much like heating a gas and making it glow.'
What we are seeing therefore are atoms and molecules in our atmosphere colliding with particles from the Sun. The aurora's characteristic wavy patterns and 'curtains' of light are caused by the lines of force in the Earth’s magnetic field.
The lowest part of an aurora is typically around 80 miles above the Earth's surface. However, the top of a display may extend several thousand miles above the Earth.
Different gases give off different colours when they are heated. The same process is also taking place in the aurora. The two primary gases in the Earth’s atmosphere are nitrogen and oxygen, and these elements give off different colours during an aurora display.
The green we see in the aurora is characteristic of oxygen, while hints of purple, blue or pink are caused by nitrogen.
'We sometimes see a wonderful scarlet red colour, and this is caused by very high altitude oxygen interacting with solar particles,' adds astronomer Tom. 'This only occurs when the aurora is particularly energetic.'
Any planet with an atmosphere and magnetic field is likely to have aurorae. Scientists have captured incredible images of aurorae on Jupiter, Saturn, Uranus and Neptune.
The aurora is a very dramatic example of the ways in which solar activity affects the Earth. Solar flares are like enormous explosions on the surface of the Sun in which streams of charged particles are emitted into space. It typically takes two days after the flare is seen on the Sun for the particles to reach Earth. Upon their arrival, these particles can result in aurora activity.
Intense aurora displays are generated following massive explosions on the Sun known as 'coronal mass ejections'. These explosions release clouds of hot plasma containing billions of tons of material travelling at around two million miles per hour. When the clouds reach the Earth, they interact with the Earth's magnetic field to cause events called geomagnetic storms.
The Sun's activity fluctuates, with activity reaching a peak every 11 years. The last time solar activity peaked was in 2014, and the cycle is now reaching its minimum. However, solar activity is predicted to rise again through to the mid-2020s.
Regardless of the Sun's activity, aurorae can still occur at any time and observers in high latitudes should always look out for them.`
  }
];

const DemoPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const optionSelect = (option) => setSelected(option);

  const generateMap = () => {
    if (selected) {
      navigate("/generate-map", { state: { context: selected.prompt, title: selected.title } });
    }
  };

  return (
    <div className="aurora-bg">
      <div className="backdrop">
        <div className="main-logo">
          <a href="/">
            <p>Map-Recallis</p>
            <img src={process.env.PUBLIC_URL + "/android-chrome-192x192.png"} alt="Map-Recallis Logo" />
            <p>Conjugate Learning</p>
          </a>
        </div>
        <div className="main-menu">
          <h2 className="main-menu-header">Demo: Choose a Topic</h2>
          <ul>
            {demoOptions.map((option, idx) => (
              <li key={idx} style={{ margin: "10px 0" }}>
                <button
                  className={`theme-btn${selected === option ? " selected" : ""}`}
                  onClick={() => optionSelect(option)}
                >
                  {option.title}
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <div style={{ marginTop: 20 }}>
              <h3>Prompt:</h3>
              <p>{selected.prompt}</p>
              <button className="theme-btn" onClick={generateMap}>
                Generate MindMap
              </button>
            </div>
          )}
        </div>
        <footer className="footer">
          <p>Map-Recallis Demo</p>
        </footer>
      </div>
    </div>
  );
};

export default DemoPage;
/* CITATION DEMO 3 https://www.rmg.co.uk/stories/topics/what-causes-northern-lights-aurora-borealis-explained */
export default function useBattery() {
  // const [state, setState] = useState({
  //     loading: true,

  // })

  if ("getBattery" in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      console.log(battery);
    });
  } else {
    console.error("Battery API is not supported on this browser.");
  }
}

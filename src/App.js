import { useEffect, useRef,useState} from 'react'


function App() {
  //Aşağıda erişebilmek adına ref kullanıyorum.
  const video = useRef(null)
  const canvas = useRef(null)
  const [barcode,setBarcode]=useState(null)
//Bu bölümde onClick eventim gerçekleştiğinde calışacak kodlar vardır.
  const openCam = () =>{
    navigator.mediaDevices.getUserMedia({video:{width:1280, height:720 }})
    .then(stream=>{
     video.current.srcObject=stream;
     video.current.play();
     
     const ctx = canvas.current.getContext('2d');
     //Barcode Detector Windows İşletim sisteminde çalışmıyor. 
     const barcode = new window.BarcodeDetector({formats: ['code_39', 'codabar', 'ean_13']});
    //Bu kısım kullandıgımız APİ'nin dökümanıdır. Açıklamıyorum.
     setInterval(()=>{
       canvas.current.width=video.current.videoWidth;
       canvas.current.height=video.current.videoHeight;
       ctx.drawImage(video.current,0,0,video.current.videoWidth,video.current.videoHeight);
       barcode.detect(canvas.current).then(([data])=>{
        if(data){
          setBarcode(data.rawValue);
        }
       })
     },100)
    })
    .catch(err=>
     console.log(err)
    )
  }

  useEffect(()=>{
    if(barcode){
      //Normal Şartlarda Bu Kontrol ile barcode var ise bir backend servise istek atıcaktık.
    }
  })

 //Eğer Barcode Detector Çalışşsaydı Canvasımdan 100 ms. de bir gelen fotoğraftan barcode numarasını alarak ekrana basıyor olucaktık.
  return (
    <div className="App">
   <button onClick={openCam}>Kamerayı Aç</button>
   <div>
    <video ref={video} autoPlay muted hidden/>
    <canvas ref={canvas} />
   </div>
   {
    barcode && (
      <div>
        Bulunan barkod : {barcode}
      </div>
    )
   }
    </div>
  );
}

export default App;

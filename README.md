# Certificate Generator — युवा समिति किशनपुरा उत्तराधा

यह एक static website है जो HTML + CSS + JavaScript + Canvas API से चलती है।

## GitHub Pages पर चलाने के तरीके

1. GitHub पर नया **Public repository** बनाएं।
2. इस पूरे folder की चारों files upload करें:
   - `index.html`
   - `style.css`
   - `script.js`
   - `certificate-template.jpg`
3. Repository में **Settings → Pages** खोलें।
4. **Deploy from a branch** चुनें।
5. Branch में `main` और folder में `/ (root)` चुनें और Save करें।
6. कुछ समय बाद GitHub Pages का URL मिल जाएगा।

## खास बात
फोटो और नाम browser में ही Canvas पर लगाए जाते हैं। किसी backend या database की जरूरत नहीं है।

## यदि नाम की जगह/फोटो बॉक्स थोड़ा बदलना हो
`script.js` में:
- नाम: `ctx.fillText(name, 785, 514, 800);`
- फोटो: `drawPhotoCover(photo, 1260, 204, 215, 247);`

इन values को बदलकर placement ठीक किया जा सकता है।

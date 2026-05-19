UPDATE public.brokers SET logo_url = CASE slug
  WHEN 'zerodha' THEN 'https://www.google.com/s2/favicons?domain=zerodha.com&sz=128'
  WHEN 'groww' THEN 'https://www.google.com/s2/favicons?domain=groww.in&sz=128'
  WHEN 'upstox' THEN 'https://www.google.com/s2/favicons?domain=upstox.com&sz=128'
  WHEN 'angel-one' THEN 'https://www.google.com/s2/favicons?domain=angelone.in&sz=128'
  WHEN 'icici-direct' THEN 'https://www.google.com/s2/favicons?domain=icicidirect.com&sz=128'
  WHEN 'hdfc-sky' THEN 'https://www.google.com/s2/favicons?domain=hdfcsky.com&sz=128'
  WHEN '5paisa' THEN 'https://www.google.com/s2/favicons?domain=5paisa.com&sz=128'
  WHEN 'kotak-securities' THEN 'https://www.google.com/s2/favicons?domain=kotaksecurities.com&sz=128'
  WHEN 'motilal-oswal' THEN 'https://www.google.com/s2/favicons?domain=motilaloswal.com&sz=128'
  WHEN 'dhan' THEN 'https://www.google.com/s2/favicons?domain=dhan.co&sz=128'
  WHEN 'fyers' THEN 'https://www.google.com/s2/favicons?domain=fyers.in&sz=128'
  WHEN 'paytm-money' THEN 'https://www.google.com/s2/favicons?domain=paytmmoney.com&sz=128'
  WHEN 'sharekhan' THEN 'https://www.google.com/s2/favicons?domain=sharekhan.com&sz=128'
  WHEN 'alice-blue' THEN 'https://www.google.com/s2/favicons?domain=aliceblueonline.com&sz=128'
  WHEN 'samco' THEN 'https://www.google.com/s2/favicons?domain=samco.in&sz=128'
  WHEN 'axis-direct' THEN 'https://www.google.com/s2/favicons?domain=axisdirect.in&sz=128'
  ELSE logo_url
END
WHERE slug IN ('zerodha','groww','upstox','angel-one','icici-direct','hdfc-sky','5paisa','kotak-securities','motilal-oswal','dhan','fyers','paytm-money','sharekhan','alice-blue','samco','axis-direct');
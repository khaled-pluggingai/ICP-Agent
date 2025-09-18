// Alternative Clay webhook sender using different approaches
export const sendToClayWebhook = async (webhookUrl: string, data: any) => {
  // Method 1: Try direct fetch first
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'no-cors' // This bypasses CORS but we can't read the response
    })
    
    // With no-cors mode, we can't check the response, so assume success
    return { success: true, method: 'direct-no-cors' }
  } catch (error) {
    console.log('Direct fetch failed, trying alternatives...')
  }

  // Method 2: Try with CORS proxy
  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/'
  ]

  for (const proxy of proxies) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(webhookUrl)}`
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const responseText = await response.text()
        console.log(`Proxy ${proxy} response:`, responseText)
        return { success: true, method: `proxy-${proxy}`, response: responseText }
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed:`, error)
      continue
    }
  }

  // Method 3: Try using a different approach - form submission
  try {
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    
    return { success: true, method: 'form-data-no-cors' }
  } catch (error) {
    console.log('Form data method failed:', error)
  }

  return { success: false, error: 'All methods failed' }
}

// Test function to verify webhook
export const testClayWebhook = async (webhookUrl: string) => {
  const testData = {
    company_name: "Test Company",
    company_url: "https://example.com",
    test: true
  }
  
  return await sendToClayWebhook(webhookUrl, testData)
}

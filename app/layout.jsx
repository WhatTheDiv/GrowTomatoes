import Nav from '@components/nav'
import '@styles/globals.css'

export const metadata = {
  title: 'Grow Tomatoes',
  description: "Source for all your growing needs"
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className='main'>
          <div className='main-background' />
        </div>

        <main className='app'>
          <Nav />
          <div className='app-body'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}

export default RootLayout
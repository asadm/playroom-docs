import React from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
const HireDeveloperCard = () => {
  return (
    <Card className="text-center py-40 m-4 mt-40">
         <h2>Hire Developers</h2>
          <p className="my-6  md:w-auto mx-auto">
          Looking for developers with multiplayer skills ? Post a job on Discord.
          </p>
          <Button>Share on  Discord</Button>
    </Card>
  )
}

export default HireDeveloperCard
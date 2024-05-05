TOTAL_POPULATION = 15
LIFE_SPAN = 350

// load matter.js
const Engine = Matter.Engine
const Composite = Matter.Composite
const Bodies = Matter.Bodies
    
class LunarLanderAI{
  setup(){
    // setup matter.js
    window.engine = Engine.create()
    window.world = window.engine.world
    window.engine.world.gravity.y = 0.5;
    Matter.Runner.run(window.engine)
    
    // add objects
    this.container = new Container()
    this.ground = Ground.getRandom()
    
    // create population
    this.population = []
    for(let i=0; i<TOTAL_POPULATION; i++){
      this.population.push(
        new SpaceShip(createVector(width/2, 50), this.ground.body, new Brain(16))
      )
    }
    
    // helper values
    this.total_died = 0
    this.landed = 0
    this.generation_number = 1
    this.generation_timestamp = 0
    
    // slider for running the generation faster
    this.speedSlider = createSlider(1, 10, 1);
  }
  
  run(){
    background('gray')
  
    // draw other objects
    this.container.draw()
    this.ground.draw()
    
    const cycles = this.speedSlider.value();
    for (let n = 0; n < cycles; n++) {
      // update all bodies
      this.population.forEach(spaceship => {
        if(spaceship.status != STATUS_ON) return
        if(this.generation_timestamp > LIFE_SPAN){
          spaceship.crashed()
          this.total_died += 1
          return
        }

        spaceship.move()
        spaceship.draw()

        if(this.checkIfLanded(spaceship, this.ground)){
          spaceship.landed()
          this.landed += 1
          this.total_died += 1
        }

        if(this.checkIfCrashed(spaceship, this.container)){
          spaceship.crashed()
          this.total_died += 1
        }
      })

      // check if generation is over
      if(this.total_died == this.population.length){
        this.nextGeneration()
      }
        
      // increase timestamp
      this.generation_timestamp += 1
    }

    // highlight the best spaceship
    let generation_best = this.population[0]
    this.population.forEach(spaceship => {
      spaceship.is_best = false
      if(spaceship.fitness > generation_best.fitness){
        generation_best = spaceship
      }
    })
    generation_best.is_best = true
      
    
    // show info
    showInfo([
      `Generation: ${this.generation_number}`,
      `Population Remaining: ${this.population.length - this.total_died}`,
      `Max Fitness: ${generation_best.fitness}`,
      `Timestamp: ${this.generation_timestamp}`,
      `Landed: ${this.landed}`,
    ])
  }
  
  nextGeneration(){
    // find best brain
    let best_spaceship = this.population[0]
    this.population.forEach(spaceship => {
      if(spaceship.fitness > best_spaceship.fitness){
        best_spaceship = spaceship
      }
    })
    let best_brain = best_spaceship.brain.copy()
    
    // delete all spaceships
    this.population.forEach(spaceship => spaceship.delete())
    
    // create new population with mutated brain
    this.population = []
    for(let i=0; i<TOTAL_POPULATION; i++){
      const start_pos = createVector(width/2, 50)
      const mutated_brain = best_brain.copy()
      mutated_brain.mutate(0.1)
      
      this.population.push(
        new SpaceShip(start_pos, this.ground.body, mutated_brain)
      )
    }
      
    // reset values
    this.generation_number += 1
    this.total_died = 0
    this.generation_timestamp = 0
    this.landed = 0

  }
  
  checkIfLanded(spaceship, ground){
    return (
      Matter.Collision.collides(spaceship.body, ground.body) != null &&
      Matter.Body.getSpeed(spaceship.body) <= 0.001 &&
      abs(spaceship.body.angle) <= 5 &&
      !spaceship.thrust_applied  
    )
  }
  
  checkIfCrashed(spaceship, container){
    let isColliding = false
    container.walls.forEach(wall => {
      if(Matter.Collision.collides(spaceship.body, wall))
        isColliding = true
    })
    return isColliding
  }
}
"""
Your task: clone the repository and update the way to calculate fitness values for spaceships. You might have to try several different ones.

Submit a zip file containing your final code and also a README file where you explain all the ways that you tried to calculate the fitness value. Readme file is just for a simple explanation, you don't have to write anything fancier.
"""


I've tried many ways to calculate the fitness values for the spaceships and spent a lot of time adjusting the fitness values. A lot of them didn't work as expected and I ended up scraping them. Listed below is the finished version and attempted.

Final Version
+ Landed Sucessfully
- Crashed
+ Speed
- Angle during landing
- Fuel Efficency
- Main Thruster
- Side Thruster

Ways attempted to calculate fitness values:
+ Above the platform with x-coordinate *Would fly past the platform
- Went passed the platform on the x-coordinate *Would think it was the best solution and keep doing it instead of landing
- Went passed the platform on the y-coordinate *Would just not apply thrusters when passing the platform to end quicker.
- General Distance from platform *Would not fly towards the platform
+ Moving towards the platform *Would fly past the platform
- Moving away from the platform *Would fly past the platform
+ Staying on the platform *Caused it to keep applying thrusters for extra points not realizing landing would be worth more.

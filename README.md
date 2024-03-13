# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Haeeun Kim|304107 |
| Natalie Bolón Brun|285155 |
| Natalia Gullón Altés|295107 |

[Milestone 1](#milestone-1-friday-3rd-april-5pm) • [Milestone 2](#milestone-2-friday-1st-may-5pm) • [Milestone 3](#milestone-3-thursday-28th-may-5pm)

## Milestone 1 (Friday 3rd April, 5pm)

**10% of the final grade**

### Dataset

The dataset we are going to use is *120 years of Olympic history: athletes and results*. The dataset is extracted from  [Kaggle](https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results) and contains data about the athletes that have taken part in the Olympics (summer and winter) from 1896 to 2016. 

The data contains over 270k entries where each entry corresponds to an athlete taking part in any sportive event. Details we can extract from the data are **Name, Year, NOC (National Olympic Committee), Sport, Event, Medal** among others. 

This dataset is already clean and ready to use, so we only need to do the data exploration and get the results that we want to visualize.

Additionally, we have created another small [dataset](data/host_cities.csv) with information about the host cities that have held the Olympics such as their country, continent and hemisphere in order to explore them in more detail.

### Problematic

Our motivation is to allow general public, in particular those people interested in sports and Olympics, to discover more details about these historical events in an interactive way. We will start by taking a historical look, showing information about the host cities and major disruptions along time. From there we want to proceed to evaluate a question: what makes a country successful? 

To analyse this question, we will go through different aspects. We can start by the influence of the number of participations: 
* participation of countries along time
* number of participants along time and also grouped by country
Then we will check the influence of sports in this "successfulness" factor:
* which sports have more events?
* how have sports varied along time? 
* which countries are more successful in each sport?
With this factors we can get an idea per country of how they perform on each of these factors (# athletes, # years participating, # sports in which they take part, etc.) and maybe even propose a new ranking that could be something like how many medals they have / how many medals they could have had taking into account all the competitions they have taken part in.

The data will be displayed in a way that allows the reader to extract information and interact in different levels. We want our visitors to learn more about the Olympics. From general facts that may not be that well known, to more detailed information that requires further analysis, the idea is that no matter how you landed in our page, you will obtain what you were looking for:

*	If you are just visiting and want to learn some general facts to later share with your friends, some text will accompany the different visualizations so that even without further engagement you can extract these facts.
*	If you are more interested in the topic and want to explore further, interactive visualizations will allow you to do so and get more insights by yourself.


### Pre-processing of the data set you chose:

We divided our first exploratory analysis in 4 parts taking different points of view. Here are the main findings of each one of them:

* **From a historical point of view**:

  * Different big historical events such as World War I and II have affected the games multiple times.
  
  * The number of athletes participating each year follow an increasing trend, with a majority of men with respect to women through all the years. However, the gap between males and females participating in the Games have been decreasing over time.
  
  * Swimming, fencing, cycling, athletics and gymnastics are the only sports that have been present in all the summer games.

  * The number of National Olympic Committees (NOCs) participating in the summer games have also been increasing over years. 
  
  * Most of the host cities of the summer Olympics are located in Europe, although the country that has held more times the summer games is the USA.
  
* **From sport point of view**:

  * The number of different events belonging to the same sport varies a lot depending on the sport. The two sports with more different events throughout the history are athletics and shooting with 83 events. These are followed by swimming, cycling and sailing. 
  
  * Most of the events have been individual (70% - 30%).
  
  * Most of the events have been for males, followed by events for females and finally mixed.
  
* **From country point of view**:

  * The USA is the country with more gold medals in total as well as in the summer Olympics. The country with more gold medals in the winter Olympics is Germany. 
  
* **From athlete point of view**:

  * Michael Phelps is the athlete with Olympic medals (total of 28) as well as the one with more gold medals.
  
  * The athlete who participated more years in the games is Ian Millar with a participation in 10 different games.

  *	The athlete who have participated in more sports did it in 5 different ones.
  
  * There are athletes who have participated in both summer and winter Olympics.
  
The whole exploratory data analysis is available [here](data_exploration.ipynb).

### Related work

We want to visualize insights from the Olympics Games. However, visualizations using the Olympics as data are not new. Some good examples are:

* [The Winter Games, by Elbert Wang](https://www.dremio.com/the-winter-olympics/)
In this visualization they show the evolution of the winter Olympics across different topics. We can take it as inspiration for some graphics (how it display medals per country looks nice) but we would like to create something more interactive where the user has more control over the data it wants to see. 

* [App Olympics Data, by Matthew Rautionmaa](https://matthewrautionmaa.shinyapps.io/Olympic_Shiny/) 
This app provides different plots using the same dataset as we plan to use. In this case, the number of plots is large and many topics are already explored. Nevertheless, no further information is shared with the user and the degree of interactivity is very limited. 

Some inspiration from other projects that are specially interesting because they outstand in one of the points we are trying to achieve with our visualization are: 

* [Pudding](https://pudding.cool/) usually present a characteristic transition in their visualizations. One example is ["Where will you need an umbrella?"](https://pudding.cool/2020/02/rain/) where they combine some data plots together with text and as the user advances the same plot introduces new data as the text displays new information. 

* A more interactive and engaging project is ["Based on a True Story, from Information is Beautiful"](https://informationisbeautiful.net/visualizations/based-on-a-true-true-story/). This project shows different movies and signals which parts are actually based on real stories and which parts are not. The interesting point is the level of freedom the user has at the time of selecting a movie and a part of it to read new information. 

* [Missing Flights, by The New York Times](https://www.nytimes.com/interactive/2020/02/21/business/coronavirus-airline-travel.html). The project provides an very nice animation at the begginning comparing two scenarios. The animation allows the user to easily spot the differences. A few information is shared at the begginning and then a more developed explanation follows. This format looks very interesting because it allows the user to choose to which level of depth it wants to explore. 



## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**

Report for Milestone 2 can be found [here](https://github.com/com-480-data-visualization/com-480-project-knn-viz/blob/master/Milestone2_Dataviz.pdf).

## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**

To see the final website, you can visit the following [link](https://com-480-data-visualization.github.io/com-480-project-knn-viz/website/map.html). Please, use Google Chrome or Firefox as browser for a better navigation experience.

The video showing how the visualization works can be found in the following [link](https://www.youtube.com/watch?v=xWv1JyJC_aY&feature=youtu.be).

The process book can be found [here](Process_Book_knn.pdf).

The project is structured as follows:

 * `data_exploration.ipynb`: data exploration of our dataset.
 * `data/`: directory containing all the data used to perform the data exploration and later to extract the data used in the website.
 * `website/`: directory containing all the files used to build the visaulization. Inside, you can find several folders used to store the data needed as well as images used in the visualization (`data/`, `logos/`, `images/`, `country-flags-master/` and `sports_picto/`). The html is stored in `map.html`, the style is defined in `map.css` and all the main visualizations and interactions (javascript files) are divided in different files according to the different sections in the website: `map.js`, `medals.js`, `new_lollipop.js` and `title.js`.
 * `index.html`: html file that redirects to the visualization (to `website/map.html`).

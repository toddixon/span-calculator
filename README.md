<style>
 .title{
 /* display:flex;
 justify-content: center;
 align-items:center;
 column-gap:20px */
 }
 .title__icon {
  /* background-color: red;
  position: relative;
  z-index: 10;
  border-radius: 20px; */
 }
 .title__text{
  /* font-size: 30pt;
  font-weight:bold; */
 }
 .dashboard {
 width:50%;
 }

 .ex1a__wrapper{
  display:flex;
  justify-content: center;
 }
 .ex1a {
 display:grid;
 grid-template-columns: repeat(2, 0.8fr);
 gap: 10px;
 grid-template-rows: repeat(2, 1fr);
 column-gap:0px;
 
 }

 .ex1a__img-a{
  /* display:none; */
 }
 .ex1a > img {
  /* justify-content: center; */
  /* align-items: center; */
  /* max-height: 500px; */
  /* row-gap:20px; */
 }
</style>


<div class="title" style="display:flex;justify-content: center;align-items:center;column-gap:20px">
 <img class="title__icon" width=12.5% src="./images/SpanCalcIcon.png" style="background-color:red;position:relative;z-index: 10;border-radius: 20px;">
 <span class="title__text" style="font-size: 30pt;font-weight:bold;">Span Calculator</span>
</div>

<div>
 <a href="Introduction">Introduction</a>
</div>

## Introduction <a name="Introduction"></a>

`Span Calculator` is an interactive tool for calculating and visually representing the proportional/linear relationship between an input and output signal. When adjustments are made to the input or output upper or lower range values, the graph and table are updated accordingly. The application also allows for calculating a specific value's proportional response, by inputting the desired value into either the input or output boxes.

<p align="center">
<img class="dashboard" src="./images/applicationD.png"/>
</p>

## Calculating Span

Uses the **slope intercept formula**:
$$y=mx + b$$

$$
\begin{gather*}
\frac{\text{Input}-LRV_{in}}{URV_{in}-LRV_{in}}=\frac{\text{Output}-LRV_{out}}{URV_{out}-LRV_{out}} = \text{per-unit ratio (x)}
\end{gather*}
$$
Solving for $\text{Input}$ and $\text{Output}$, we get two equations:
$$
\begin{gather*}
\text{Input}=(URV_{in}-LRV_{in})\cdot\text{x}+LRV_{in}\\
\text{or}\\
\text{Output}=(URV_{out}-LRV_{out})\cdot\text{x}+LRV_{out}
\end{gather*}
$$

- $URV_{in}$
  - The output range **high** feedback/response of the sensing device
- $LRV_{in}$
  - The output range **low** feedback/response of the sensing device

- $URV_{out}$
  - The unit output range **high** of the sensing device
- $LRV_{out}$
  - The unit output range **low** of the sensing device

### Example problems

1. **4-20mA** pressure sensor is giving us **8.5mA** back. If the pressure sensors range is **0-50psi**, what **pressure** is it reading?
<div class=ex1a__wrapper>

<div class="ex1a">
 <img class="ex1a__img-a" src="./images/examples/1a.png"/>
 <img class="ex1a__img-b" src="./images/examples/1b.png"/>
 <img class="ex1a__img-c" src="./images/examples/1c.png"/>
 <img class="ex1a__img-d" src="./images/examples/1d.png"/>
</div>
</div>

- Starting with the $\text{Input}$ equation:

$$
\begin{gather*}
8.5 = (20-4) \cdot x + 4\\
4.5 = 16 \cdot x\\
x = 0.28125=\%28.13\\
\end{gather*}
$$

- Now that we have the per-unit percentage of milliamp signal we can now calculate the pressure

$$
\begin{gather*}
\text{Output} = (50-0) \cdot (0.28125) + 0\\
\text{Output} = 50 \cdot (0.28125)\\
\text{Output} = 14.1\text{psi}
\end{gather*}
$$

***

2. The sensor is now reading **32psi**. What should the milliamp reading be?

- Starting with the $\text{Output}$ equation:

$$
\begin{gather*}
32 = (50-0) \cdot x + (0)\\
32 = 50 \cdot x\\
x=0.64=64\%
\end{gather*}
$$

- Now calculate the current

$$
\begin{gather*}
\text{Input} = (20-4) \cdot (0.64)+ 4\\
\text{Input} = 14.24\text{mA}
\end{gather*}
$$

## Creating the Plot

Once we have calculated our primary signals slope intercept formula, the application uses **linear interpolation** to calculate a total of 10 points from

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


[Introduction](#Introduction)
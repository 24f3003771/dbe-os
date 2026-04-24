# Module 1: Non-Parametric Methods

## 1.0 Welcome to the Module
*   **Introduction**: This module introduces non-parametric statistical methods as robust alternatives to parametric approaches.
*   **Core Objective**: To provide a foundation in three key areas:
    *   Chi-square test of independence.
    *   Goodness of fit tests.
    *   Wilcoxon Signed Rank tests.
*   **Relevance**: These methods are essential when data is categorical, skewed, contains outliers, or when sample sizes are too small to satisfy the assumption of normality required by parametric tests.

---

## 1.1 Parametric and Non-Parametric Methods

### 1.1.1 Parametric Methods
*   **Definition**: Methods that rely on numbers summarizing population characteristics, known as **parameters**.
*   **Key Parameters**:
    *   **Population mean ($\mu$)**
    *   **Population proportion ($p$)**
    *   **Population variance ($\sigma^2$)**
*   **Assumptions**:
    *   Observations follow a specific probability distribution (e.g., Normal, Bernoulli).
    *   **Normality Assumption**: The data is assumed to be normally distributed.
*   **Performance**: Highly efficient and powerful when assumptions are met; requires fewer data points for accurate estimates.

### 1.1.2 Non-Parametric Methods
*   **Definition**: Often called **Distribution-free methods**, they do not make assumptions about the underlying distribution of the data.
*   **Characteristics**:
    *   More flexible and robust against outliers and skewed data.
    *   Useful for analyzing categorical data (demographics, satisfaction levels).
    *   Typically require larger sample sizes to achieve the same precision as parametric tests.
*   **Core Philosophy**: Focuses on the **relative ranks** or distribution patterns of observations rather than raw parameter estimates.

### 1.1.3 Comparison Table

| Feature | Parametric Methods | Non-Parametric Methods |
| :--- | :--- | :--- |
| **Data Distribution** | Assumes specific distribution (e.g., Normal) | Distribution-free (No assumptions) |
| **Parameters** | Estimates $\mu, p, \sigma^2$ directly | Focuses on ranks/relative positions |
| **Robustness** | Sensitive to outliers and skewness | Robust to outliers and anomalies |
| **Sample Size** | Effective with smaller samples if normal | Requires larger samples for same precision |
| **Quantitative Power**| Can quantify differences explicitly | Often only indicates if a difference exists |

---

## 1.2 Concept of Independence in Statistics

### 1.2.1 Definition of Independence
*   **Concept**: Two events are independent if the occurrence of one does not affect the occurrence of the other. Knowing one event happened provides no information about the other.
*   **Multiplication Rule**: Two events $A$ and $B$ are independent if:
    $$P(A \cap B) = P(A) \cdot P(B)$$

### 1.2.2 Testing Independence with Chi-Square Test
*   **Purpose**: To determine if there is a significant association between two categorical variables.
*   **Null Hypothesis ($H_0$)**: The two variables are independent.
*   **Alternative Hypothesis ($H_1$)**: The two variables are dependent (not independent).

#### Steps to Test Independence:
1.  **Collect Data**: Organize data into a **Contingency Table** (Two-way frequency table).
2.  **Calculate Expected Frequencies ($E_{ij}$)**: Based on the assumption of independence:
    $$E_{ij} = \frac{(\text{Row Total}) \cdot (\text{Column Total})}{\text{Overall Sample Size}}$$
3.  **Compute Chi-Square Statistic ($\chi^2$)**:
    $$\chi^2 = \sum_{i,j} \frac{(O_{ij} - E_{ij})^2}{E_{ij}}$$
    *   Where $O_{ij}$ is the observed frequency in row $i$ and column $j$.
4.  **Identify Degrees of Freedom ($df$)**:
    $$df = (r - 1)(c - 1)$$
    *   Where $r$ = number of rows and $c$ = number of columns.
5.  **Determine P-Value**: Compare the statistic against the $\chi^2$ distribution using Excel's `CHISQ.DIST.RT()` function.

### 1.2.3 Continuous Data and Discretization
*   Chi-square tests can be used for continuous variables by **discretizing** them into intervals or "bins."
*   **Rule of Thumb**: Avoid too few or too many bins; ensure each cell has a balanced number of observations (avoid zero counts).

---

## 1.3 Concept of Goodness of Fit Test

### 1.3.1 Definition
*   A statistical method used to determine how well observed sample data matches a particular theoretical distribution (e.g., Uniform, Poisson, or Normal).

### 1.3.2 Objectives
*   Check if deviations between observed and expected frequencies are due to random chance.
*   Determine if deviations are significant enough to reject the null hypothesis ($H_0$: Data follows the expected distribution).

### 1.3.3 Common Distributions Tested
*   **Uniform Distribution**: Tests if all outcomes in a range are equally likely (e.g., employee satisfaction between 0 and 1).
*   **Poisson Distribution**: Used for modeling occurrences within a fixed interval (e.g., number of defects, customer arrivals).
    *   **Excel Function**: `POISSON.DIST(x, mean, cumulative)`
*   **Normal Distribution**: Characterized by population mean and standard deviation.
    *   **Excel Function**: `NORM.DIST(x, mean, standard_dev, cumulative)`

### 1.3.4 Degrees of Freedom for Goodness of Fit
*   The general formula is:
    $$df = k - 1 - p$$
    *   $k$ = Number of intervals/bins.
    *   $p$ = Number of parameters estimated from the data (e.g., $p=1$ for Poisson [$\lambda$], $p=2$ for Normal [$\mu, \sigma$]).

---

## 1.4 Wilcoxon Signed Rank Test

### 1.4.1 Overview
*   A non-parametric alternative to the **One-sample t-test** or **Paired t-test**.
*   It evaluates the magnitude and direction of differences from a hypothesized **median** rather than the mean.
*   **Advantage**: Less sensitive to outliers and does not require normality.

### 1.4.2 One-Sample Wilcoxon Test Steps
1.  **Calculate Differences**: Find the difference between each observed value and the hypothesized median.
2.  **Rank Absolute Differences**: Rank the differences by their absolute values. For tied ranks, use the average rank.
3.  **Assign Signs**: Apply the original sign (+ or -) to the ranks.
4.  **Calculate Test Statistic ($W^+$)**:
    *   $W^+$ = Sum of positive signed ranks.
    *   $W^-$ = Sum of negative signed ranks.
    *   **Relationship**: $W^+ + W^- = \frac{n(n+1)}{2}$
5.  **Large Sample Framework ($n \geq 30$)**: Compute a **Z-score** to determine the p-value.
    *   Decision Rule: Reject $H_0$ if $|z\text{-score}| > 1.96$ (at 5% significance level).

### 1.4.3 Paired Wilcoxon Signed-Rank Test
*   Used to compare two related samples (e.g., before and after a marketing campaign).
*   Focuses on the **median difference** between pairs.
*   $H_0$: The median difference between pairs is zero.

### 1.4.4 Mann-Whitney U Test
*   Also known as the **Wilcoxon Rank-Sum Test**.
*   Used to compare two **independent** groups.
*   Determines if one group tends to have higher or lower scores than the other.

---

## 1.5 Recap
*   **Parametric vs. Non-Parametric**: Choice depends on data distribution assumptions and sample size.
*   **Chi-Square Independence**: Essential for categorical relationship analysis in business (e.g., Salary vs. Department).
*   **Goodness of Fit**: Validates if business models (like demand forecasting) align with reality.
*   **Wilcoxon Test**: A robust tool for comparing medians and paired observations without assuming normality.

---

## Quick Revision Summary

### Key Definitions
*   **Distribution-Free**: Methods that do not assume a specific population distribution.
*   **Contingency Table**: A table used to summarize the relationship between categorical variables.
*   **Discretization**: The process of dividing continuous data into discrete bins.

### Important Formulas
*   **Chi-Square Statistic**: $\chi^2 = \sum \frac{(O-E)^2}{E}$
*   **Independence Degrees of Freedom**: $df = (r-1)(c-1)$
*   **Goodness of Fit Degrees of Freedom**: $df = k - 1 - p$
*   **Wilcoxon Rank Sum Total**: $W^+ + W^- = \frac{n(n+1)}{2}$

### Must-Remember Points
*   **Reject $H_0$** if the P-value is less than the significance level ($\alpha$, usually 0.05).
*   **Small Sample Wilcoxon**: Requires a specific critical value table instead of the Z-score.
*   **Expected Frequency**: In a Chi-Square test, no cell should have a count of zero; cells should be merged if counts are too low.
*   **Excel Functions**:
    *   `CHISQ.DIST.RT`: P-value for Chi-Square.
    *   `RANK.AVG`: Assigns average ranks for ties in Wilcoxon tests.

# Module 2: Advanced Regression Methods

## 2.0 Welcome to the Module
*   **Introduction**: This module expands on Term 1 concepts by moving from basic linear models to advanced techniques like Logistic and Non-Linear regression.
*   **Core Goal**: To equip learners with skills to model complex, real-world data where standard assumptions (like normality or linearity) fail.
*   **Business Applications**: Used for predicting customer behavior (quitting/buying), housing price trends, marketing effectiveness, and credit risk management.

---

## 2.1 Linear Regression

### 2.1.1 Overview
*   **Definition**: A statistical method used to model the relationship between a **dependent variable** and one or more **independent variables**.
*   **Simple Linear Regression**: Examines 1 dependent and 1 independent variable.
*   **Multiple Linear Regression**: Factors in multiple independent variables simultaneously (e.g., predicting sales using advertising spend, price, and economic conditions).

### 2.1.2 Key Assumptions of Linear Regression
To ensure valid and reliable predictions, five key assumptions must hold:

| Assumption | Definition | Violation Outcome |
| :--- | :--- | :--- |
| **Linearity** | The relationship between $X$ and $Y$ is a straight line. | Model cannot represent diminishing returns or sharp shifts. |
| **Independence of Residuals** | Errors (residuals) should not be correlated with each other. | Correlated errors (common in time series/stock data). |
| **Homoscedasticity** | Constant variance of errors across all levels of independent variables. | **Heteroscedasticity**: Error spread changes (common in income data). |
| **Normality of Residuals** | Residuals should follow a normal distribution. | Disrupts hypothesis testing and confidence intervals. |
| **No Multicollinearity**| Independent variables should not be highly correlated with each other. | Hard to isolate the individual effect of each variable. |

### 2.1.3 Two-Sample Mean Comparison using Regression
*   **Concept**: A linear regression model can perform the same function as a two-sample t-test or a non-parametric Wilcoxon rank-sum test.
*   **Method**: Use a **binary indicator variable** (Dummy Variable) where $X=1$ for one group and $X=0$ for the other.
*   **Model**: $$Y = \beta_0 + \beta_1 X + \epsilon$$
    *   $\beta_0$: Mean of the group where $X=0$.
    *   $\beta_0 + \beta_1$: Mean of the group where $X=1$.
    *   $\beta_1$: The difference in means between the two groups.
*   **Significance**: If the p-value for $\beta_1$ is significant, the groups have different behaviors.

---

## 2.2 Logistic Regression

### 2.2.1 Core Concepts
*   **Definition**: A technique used when the dependent variable is **categorical** and **binary** (e.g., Yes/No, Success/Failure, Attrition/Retention).
*   **Limitation of Linear Regression**: Linear models are unbounded and can predict probabilities $> 1$ or $< 0$.
*   **Sigmoid (Logistic) Function**: Transforms the linear relationship into an **S-shaped curve** that limits outputs to values between 0 and 1.
*   **Bernoulli Distribution**: The foundation of logistic regression where Success = $p$ and Failure = $1-p$.

### 2.2.2 Mathematical Framework
*   **Odds**: The ratio of the probability of an event occurring to it not occurring.
    $$odds = \frac{p}{1-p}$$
*   **Logit (Log-Odds)**: Logistic regression models the **logarithm of the odds** as a linear function.
    $$\log\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k$$
*   **Probability Formula**: To find the actual probability ($p$):
    $$p = \frac{\exp(\beta_0 + \beta_1 X_1 + \dots)}{1 + \exp(\beta_0 + \beta_1 X_1 + \dots)}$$

### 2.2.3 Parameter Estimation (Maximum Likelihood Estimation)
*   Unlike linear regression (Least Squares), logistic regression uses **Maximum Likelihood Estimation (MLE)**.
*   **Process**: It iteratively tests coefficient values to find the set that maximizes the likelihood of the observed outcomes matching the predicted probabilities.
*   **Log-Likelihood**: Because multiplying probabilities results in extremely small numbers, the **sum of log-probabilities** is maximized instead.

### 2.2.4 Interpretation of Coefficients
*   **Sign**: A positive coefficient increases the log-odds (and thus the probability), while a negative coefficient decreases it.
*   **Non-linearity**: A unit change in $X$ does not change the probability by a constant amount; the impact depends on the current value of $p$.

---

## 2.3 Non-Linear Regression

### 2.3.1 Motivation
*   Used when the relationship between variables is inherently complex or curved.
*   Common in scenarios like **diminishing returns** (advertising) or **S-shaped growth** (market penetration).

### 2.3.2 Types of Non-Linear Models
*   **Polynomial Regression**:
    *   **Quadratic**: $Y = \beta_0 + \beta_1 X + \beta_2 X^2$ (Parabolic curve).
    *   **Cubic**: $Y = \beta_0 + \beta_1 X + \beta_2 X^2 + \beta_3 X^3$.
*   **Exponential Regression**: Models rapid growth where the dependent variable increases at an accelerating rate.
*   **Logarithmic Regression**: Used when the variable rises rapidly at first then stabilizes (diminishing returns).
*   **Power Regression**: The rate of change in $Y$ is proportional to the change in $X$.

---

## 2.4 Case Study & Model Refinement

### 2.4.1 Handling Skewed Data
*   In variables like housing prices or income, data is often **positively skewed**.
*   **Logarithmic Transformation**: Taking the log of the dependent variable (e.g., $\log(\text{Price})$) often makes the distribution more symmetric and suitable for regression.

### 2.4.2 Variable Selection Methods
To avoid **overfitting** (making the model too complex for new data), three main selection methods are used:
1.  **Forward Selection**: Start with an empty model and add variables one by one that improve $R^2$ significantly.
2.  **Backward Elimination**: Start with all variables and remove the one with the highest p-value (least significant) until only significant ones remain.
3.  **Stepwise Selection**: A combination where variables can be both added and removed at each step.

### 2.4.3 Interaction and Fixed Effects
*   **Fixed Effects**: Controlling for unique, unobservable characteristics of entities (e.g., specific departments in an organization) using dummy variables.
*   **Interaction Effects**: Occur when the effect of one independent variable on the outcome changes depending on the value of another variable.
    *   Example: A workplace accident's impact on satisfaction might vary depending on the employee's salary level.

---

## 2.5 Recap

### 2.5.1 Cross-Validation
*   **Procedure**: Splitting a dataset into **Training** (to build the model) and **Testing** (to evaluate accuracy).
*   **Purpose**: To check how well the model predicts prices or outcomes on unseen data.

---

## Quick Revision Summary

### Key Definitions
*   **Heteroscedasticity**: Non-constant variance of errors.
*   **Logit**: The natural log of the odds.
*   **Multicollinearity**: High correlation between independent variables.
*   **Overfitting**: A model that fits training data perfectly but fails to generalize to new data.

### Important Formulas
*   **Log-Odds**: $\log(\text{odds}) = \beta_0 + \beta_1 X$
*   **Odds**: $odds = \frac{p}{1-p}$
*   **Probability**: $p = \frac{1}{1 + \exp(-(\beta_0 + \beta_1 X))}$
*   **Quadratic Polynomial**: $Y = \beta_0 + \beta_1 X + \beta_2 X^2$

### Must-Remember Points
*   Logistic regression outputs **probabilities** between 0 and 1.
*   Use **dummy variables** ($n-1$ columns) to represent categorical variables with $n$ categories.
*   The **p-value** of a coefficient tells you if the variable has a statistically significant impact on the outcome.
*   **Log-transformation** is the primary tool for correcting positive skewness in business data.

# Module 3: Predictive Analysis

## 3.0 Welcome to the module
*   **Definition**: Forecasting is the process of making predictions about future events based on historical data and statistical techniques.
*   **Purpose**: It guides decision-making and strategic planning by helping businesses anticipate future conditions, trends, and customer behavior.
*   **Planning Horizon**: 
    *   **Short-term**: Predicting for the next week or month (e.g., bakery sales).
    *   **Long-term**: Projecting growth over a decade or more.

---

## 3.1 Concept of Forecasting
### 3.1.1 Business Applications
| Application | Goal | Example |
| :--- | :--- | :--- |
| **Demand** | Align stock levels with customer needs. | Retailers forecasting holiday sales to avoid overstocking/stockouts. |
| **Financial** | Budgeting and strategic planning. | Startups predicting cash flow to assess when they reach profitability. |
| **Sales** | Setting realistic revenue targets. | Car dealerships predicting demand for specific models by season. |
| **Workforce** | Determining staffing needs. | Hotels hiring extra staff during peak tourist seasons. |
| **Risk Management** | Predicting potential losses. | Banks assessing the likelihood of loan defaults. |
| **Fraud Detection** | Identifying abnormal behaviors. | Credit card companies flagging transactions that deviate from patterns. |
| **Marketing** | Retention and targeted campaigns. | Streaming services predicting customer churn based on engagement. |

---

## 3.2 Linear Regression for Forecasting
### 3.2.1 Predictive Analysis of Continuous Data
*   Linear regression models the relationship between independent variables and a **continuous dependent variable**.
*   **Fitted Equation**: Once trained, the fitted line is used to input anticipated values of predictors to generate a forecast.

### 3.2.2 Data Splitting and Cross-Validation
To ensure a model generalizes well and avoids **overfitting** (fitting noise rather than patterns), data is split:
*   **Training Data**: Used to develop the model and learn relationships.
*   **Testing Data**: Unseen data used to assess performance. In time series, this is usually the **last few observations**.
*   **K-fold Cross-Validation**: Splitting data into $k$ subsets; the model is trained/tested $k$ times, with each subset serving as the test set once.

### 3.2.3 Predictive Accuracy Metrics
For continuous outcomes, error is measured as the deviation between actual ($Y_i$) and predicted ($\hat{Y}_i$) values:

| Metric | Definition | Formula |
| :--- | :--- | :--- |
| **$r^2$** | Proportion of variance explained by the model. | Ranges from 0 to 1. |
| **MAE** | **Mean Absolute Error**: Average magnitude of errors without direction. | $\frac{1}{n} \sum_{i=1}^{n} |Y_i - \hat{Y}_i|$ |
| **MSE** | **Mean Squared Error**: Penalizes larger errors more heavily. | $\frac{1}{n} \sum_{i=1}^{n} (Y_i - \hat{Y}_i)^2$ |
| **RMSE** | **Root Mean Squared Error**: Brings error back to the original units. | $\sqrt{\text{MSE}}$ |
| **MAPE** | **Mean Absolute Percentage Error**: Accuracy in relative terms. | $\frac{100}{n} \sum_{i=1}^{n} \frac{|Y_i - \hat{Y}_i|}{|Y_i|}$ |

---

## 3.3 Logistic Regression for Forecasting
### 3.3.1 Forecasting Categorical Data
*   Used for **binary outcomes** (e.g., purchase vs. no purchase, churn vs. stay).
*   Models the **probability** ($p$) of an event occurring (0 to 1) using the **logistic/sigmoid function**.

### 3.3.2 Classification Accuracy Metrics
Predictive performance is evaluated using a **Confusion Matrix**:

| | Predicted: TRUE | Predicted: FALSE |
| :--- | :--- | :--- |
| **Actual: TRUE** | **True Positive (TP)** | **False Negative (FN)** |
| **Actual: FALSE** | **False Positive (FP)** | **True Negative (TN)** |

*   **Accuracy**: Proportion of correct predictions: $\frac{TP + TN}{Total}$.
*   **Precision**: Accuracy of positive predictions: $\frac{TP}{TP + FP}$.
*   **Recall (Sensitivity)**: Ability to identify all positive cases: $\frac{TP}{TP + FN}$.
*   **F1 Score**: Harmonic mean of Precision and Recall: $\frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$.
*   **AUC-ROC**: Plots True Positive Rate against False Positive Rate. An AUC closer to 1 indicates better discriminatory power.
*   **Quadratic Score**: Measures the quality of probabilistic predictions. Formula: $\frac{1}{n} \sum_{i=1}^{n} (Y_i - \hat{p}_i)^2$.

---

## 3.4 Time Series Data
### 3.4.1 Definition and Characteristics
*   Data collected at specific time intervals (daily, monthly, yearly) and organized **chronologically**.
*   Requires specialized methods because observations are **time-dependent**.

### 3.4.2 Components of Time Series
1.  **Trend**: The long-term direction of the data (upward, downward, or flat).
2.  **Seasonality**: Predictable patterns that repeat at regular intervals (e.g., weekends in a bakery, summer in tourism).

### 3.4.3 Identifying Patterns in Excel
*   **Visualization**: Using line charts to assess trends and cycles.
*   **Moving Average**: Calculates the average within a sliding window (e.g., 7-day period) to smooth out fluctuations.
*   **Seasonal Index**: Calculated by dividing an actual value by the average of that period across multiple years to see if it is above/below average.

---

## 3.5 Methods of Forecasting
### 3.5.1 Simple Forecasting Methods
| Method | Description | Best For |
| :--- | :--- | :--- |
| **Naive** | Forecast for next period = most recent value ($F_{t+1} = Y_t$). | Stable data, no strong trends/seasonality. |
| **Seasonal Naive**| Forecast = observed value from same period in previous season. | Data with strong, repeating seasonal patterns. |
| **Average** | Forecast = average of all past observations. | Stable data with no trend. |
| **Weighted Avg** | Assigns more weight to recent observations. | Data where recent trends are more relevant. |
| **Drift** | Assumes consistent rate of change based on average change between first and last points. | Data with a clear, consistent linear trend. |

### 3.5.2 Exponential Smoothing
*   A special weighted average where weights decrease **exponentially** as observations get older.
*   **Forecast Formula**: 
    $$F_{t+1} = \alpha Y_t + (1 - \alpha)F_t$$
    *   $\alpha$ = **Smoothing parameter** (0 to 1). Higher $\alpha$ emphasizes recent data.
    *   $1-\alpha$ = **Damping factor**.
*   **Benefits**: Adaptability to quick changes and smoothness in filtering out extreme fluctuations.

---

## 3.6 Autocorrelation
### 3.6.1 Concept
*   Also known as **lagged correlation** or serial correlation.
*   It measures the correlation of a time series with its own past values.
*   **Positive Autocorrelation**: High values followed by high values (e.g., summer temperatures).
*   **Negative Autocorrelation**: High values followed by low values (alternating patterns).

### 3.6.2 Autoregressive (AR) Models
*   The current value is modeled as a function of its past values.
*   **AR(1) Model**: The current value is influenced by the immediate previous value (lag 1).
    $$Y_{t+1} = \beta_0 + \beta_1 Y_t + \epsilon$$
*   **Order of AR**: Determined by checking autocorrelation at multiple lags and using cross-validation.

---

## Quick Revision Summary
*   **Forecasting** predicts the future using past trends; accuracy is validated using training/testing splits.
*   **RMSE** and **MAPE** are primary metrics for continuous data (Regression).
*   **Confusion Matrix**, **F1 Score**, and **AUC** are primary for binary outcomes (Logistic).
*   **Trend** is the long-term direction; **Seasonality** is the repeating short-term cycle.
*   **Naive Method**: $F_{t+1} = Y_t$.
*   **Exponential Smoothing**: $F_{t+1} = \alpha Y_t + (1 - \alpha)F_t$.
*   **Autocorrelation** reveals how much "memory" the data has of its past, which is exploited by **Autoregressive (AR)** models.
*   **Exogenous Regressors**: External factors (like inflation in gold price forecasting) that provide additional predictive power.


# Module 4: Statistical Methods in Quality Management

## 4.1 Statistics in Quality Management

### 4.1.1 Overview of Quality Management
*   **Definition**: A systematic approach ensuring that products, services, or processes meet or exceed customer expectations.
*   **Core Activities**: Planning, monitoring, and continuously improving operations to deliver reliable results.
*   **Key Principles**:
    *   Customer focus.
    *   Process optimization.
    *   Continuous improvement.
    *   Evidence-based decision-making.

### 4.1.2 The Role of Statistics
*   **Scientific Improvement**: Statistics offers tools to measure and analyze quality scientifically rather than relying on intuition.
*   **Variation Identification**: Helps distinguish between natural process variations and root causes of defects.
*   **Sampling Methods**: Allows businesses to evaluate quality without inspecting every single unit, significantly saving time and costs.
*   **Standard Frameworks**:
    *   **TQM (Total Quality Management)**: Focuses on long-term success through customer satisfaction.
    *   **Six Sigma**: A data-driven method aimed at reducing process variability to achieve near-perfect quality levels.
    *   **ISO Standards**: Structured approaches to enhance quality and efficiency.

---

## 4.2 Hypothesis Testing

### 4.2.1 Errors in Hypothesis Testing
In quality control, decisions are based on the null hypothesis ($H_0$), usually stating that a product meets quality standards. Misjudging leads to two primary errors:

| Error Type | Definition | Terminology | Business Consequence |
| :--- | :--- | :--- | :--- |
| **Type I Error** | Rejecting $H_0$ when it is actually **true**. | **False Positive** | Unnecessary rework, extra inspections, or discarding good batches; higher costs. |
| **Type II Error** | Failing to reject $H_0$ when it is actually **false**. | **False Negative** | Releasing substandard/defective products; leads to recalls, legal liability, and safety risks. |

### 4.2.2 Significance Levels and Power
*   **Alpha ($\alpha$)**: The probability of a Type I error, conventionally set at **0.05**. In critical cases, it may be reduced to **0.01**.
*   **Beta ($\beta$)**: The probability of a Type II error. Minimizing $\beta$ is essential for safety and compliance.
*   **Balancing Risks**: Quality managers balance these risks by increasing sample sizes or conducting more rigorous testing.

### 4.2.3 Case Illustrations
*   **Manufacturing (Steel Rods)**: A two-tailed t-test is used to check if the mean diameter deviates from a target (e.g., 5.00 mm). If the p-value is less than 0.05, the machinery is recalibrated.
*   **Supplier Quality (Brake Pads)**: A one-tailed t-test assesses if the mean strength is below a minimum threshold (e.g., 100 MPa). If the p-value exceeds 0.05, the deviation is considered due to chance, and the batch is accepted.

---

## 4.3 Regression Analysis

### 4.3.1 Application in Quality Control
*   **Relationship Modeling**: Regression models the link between independent input variables (e.g., machine speed, temperature) and dependent quality outcomes (e.g., defect rates, product weight).
*   **Key Drivers**: Identifies which specific factors most significantly influence quality.
*   **Process Optimization**: Helps determine the "optimal settings" of inputs to minimize defects.

### 4.3.2 Logistic Regression for Attribute Data
*   **Binary Outcomes**: Useful when the output is categorical, such as **Pass/Fail** or **Defect/No Defect**.
*   **Probability Estimation**: Models the likelihood of a defect based on current process conditions, enabling proactive adjustments.

---

## 4.4 Statistical Decision Theory

### 4.4.1 Key Elements of Decision Theory
1.  **Acts or Actions**: The alternative courses of action available (e.g., Launch product vs. Delay).
2.  **States of Nature**: Uncertain future events beyond the decision-maker's control (e.g., High vs. Low market demand).
3.  **Payoff**: A numerical value (usually profit or loss) resulting from a specific combination of an action and a state of nature.
4.  **Decision Rule**: The criterion used to select the best action.

### 4.4.2 Payoff and Regret Matrices
*   **Payoff Matrix**: A table showing potential earnings for each action under different states.
*   **Opportunity Loss (Regret) Matrix**: Quantifies the "regret" of not choosing the best action.
    *   **Formula**: $\text{Regret} = \text{Maximum Payoff in State} - \text{Payoff of Chosen Action}$.

### 4.4.3 Decision Criteria Under Uncertainty
*   **Maximax (Criterion of Optimism)**: Selects the action with the highest possible payoff ("Best of the Best").
*   **Maximin (Criterion of Pessimism)**: Selects the action with the highest minimum payoff ("Best of the Worst"); a conservative, security-focused approach.
*   **Minimax Regret**: Aims to minimize the maximum possible regret from the opportunity loss matrix.
*   **Hurwicz Criterion (Criterion of Realism)**: A weighted average of the maximum and minimum payoffs.
    *   **Formula**: $$P = \alpha(\text{Max Payoff}) + (1 - \alpha)(\text{Min Payoff})$$
    *   $\alpha$ represents the **degree of optimism** (0 to 1).

---

## 4.5 Statistical Process Control (SPC)

### 4.5.1 Types of Variation
SPC is a data-driven approach to monitor processes and identify two types of variation:
*   **Common Cause Variation**: Natural, expected fluctuations due to minor, uncontrollable factors. These are low in magnitude.
*   **Special Cause Variation**: Result from specific issues like equipment malfunction or human error. These require immediate intervention.

### 4.5.2 Control Charts (Shewhart Charts)
Control charts visually represent process stability using three components:
1.  **Central Line (CL)**: Represents the process average or expected value.
2.  **Upper/Lower Control Limits (UCL/LCL)**: Define the acceptable range of variation, typically set at **$\pm$ 3 standard deviations**.
3.  **Data Points**: Actual observations plotted over time to detect trends or shifts.

### 4.5.3 Common Control Chart Types
| Chart Type | Data Type | Purpose |
| :--- | :--- | :--- |
| **$\bar{X}$ Chart** | Continuous | Monitors changes in the process mean (e.g., average weight). |
| **R Chart** | Continuous | Monitors process variability/range. |
| **P Chart** | Categorical | Tracks the **proportion** of defective items; used when sample sizes vary. |
| **NP Chart** | Categorical | Tracks the **number** of defective units; used when sample sizes are constant. |

### 4.5.4 Six Sigma Rule
*   An advanced quality standard aiming for **99.99966%** accuracy.
*   Operates at **$\pm$ 6 standard deviations** from the mean.
*   Achieves an extremely low defect rate of only **3.4 defects per million** opportunities.

---

## 4.6 Design of Experiments (DOE)

### 4.6.1 Methodology
*   **Definition**: A structured approach to determine the relationship between multiple factors and outcomes simultaneously.
*   **Efficiency**: Unlike testing one factor at a time, DOE tests multiple variables at once, reducing costs and resource usage.
*   **Full Factorial Experiment**: A design where every possible combination of factor levels is tested to identify the absolute best configuration.

### 4.6.2 Business Impact
*   **Manufacturing**: Optimizing variables like compression force and drying time in pharmaceutical tablet production.
*   **Marketing**: Testing subject lines, email designs, and discount offers to optimize click-through rates.
*   **Outcome**: Higher ROI, improved customer retention, and reduced failure risks before market launch.

---

## Quick Revision Summary
*   **Type I Error**: False positive (rejecting good batches).
*   **Type II Error**: False negative (accepting bad batches).
*   **SPC Variation**: Differentiate between **Common Cause** (natural) and **Special Cause** (problematic).
*   **Control Limits**: Set at **Mean $\pm$ 3 Sigma**; any point outside signals a process out of control.
*   **Decision Criteria**: **Maximax** (optimist), **Maximin** (pessimist), **Hurwicz** (balanced weighted average).
*   **DOE**: Systematic testing of variables together to find the optimal combination for high quality and low cost.
*   **Six Sigma**: Target of **3.4 defects per million** via $\pm$ 6 standard deviations.
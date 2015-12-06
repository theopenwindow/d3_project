scatter <- read.csv("scatter_data_complete.csv")
dim(scatter)
head(scatter)

C <- scatter$Total.adult.literacy.rate
C <- scatter$GNI.per.capita
C <- scatter$GNI.per.capita
C
C <- gsub("_","NA",C)
head(scatter)


scatter <- na.omit(scatter)
dim(scatter)
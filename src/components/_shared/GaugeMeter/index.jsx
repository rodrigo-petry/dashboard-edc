import React from "react";
import PropTypes from "prop-types";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    maxWidth: "200.0px",
    marginTop: "-22px",
    
  },

  wrapperComSemana: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    maxWidth: "200.0px",
    
  },
  gauge: {
    position: "relative",
  },
  value: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.2em",
    lineHeight: "1.2em",
    fontWeight: "900",
  },
  valueComUnidade: {
    position: "absolute",
    top:  "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.2em",
    lineHeight: "1.2em",
    fontWeight: "900",
  },
  format: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.0em",
    lineHeight: "1.2em",
    fontWeight: "900",
  },
  label: {
    fontWeight: 700,
    textAlign: "center",
    bottom: 0,
  },
  needle: {
    fill:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[3],
  },
}));

const GaugeMeter = ({
  value = 0,
  min = 0,
  max = 100,
  marks = [],
  label,
  formatter,
  unidade=null,
  semana=null,
  inicioEfimDaSemana = null,
}) => {
  const { classes } = useStyles();

  const backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 1.25)
    .endAngle(Math.PI / 1.25)();

  const percentScale = scaleLinear().domain([min, max]).range([0, 1]);
  const percent = percentScale(value);
  

  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 1.25, Math.PI / 1.25])
    .clamp(true);

  const angle = angleScale(percent);

  const filledArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 1.25)
    .endAngle(angle)();

  const arcs = marks
    .map((item) => {
      if (item.value && item.color) {
        const p = percentScale(item.value);
        const a = angleScale(p);

        const d = arc()
          .innerRadius(0.65)
          .outerRadius(1)
          .startAngle(a)
          .endAngle(a + 0.02)();

        return { d, fill: item.color };
      }

      return null;
    })
    .filter((item) => item);

  return (
    <div className={semana ? classes.wrapperComSemana : classes.wrapper}    >
      <div className={classes.gauge}>
        <svg
          style={{ overflow: "visible" }}
          width="7em"
          viewBox={[-1, -1, 2, 2].join(" ")}
        >
          <path d={backgroundArc} fill="#CACACA" />
          <path d={filledArc} fill="#77D192" />
          {arcs.map((a) => (
            <path key={a.d} d={a.d} fill={a.fill} />
          ))}
        </svg>

        <div className={unidade ? classes.valueComUnidade : classes.value}>
          {formatter ? formatter(value) : value}
        </div>
        {unidade && <div className={classes.format}>
          {unidade}
        </div>}
      </div>

      {!!label && <div className={classes.label}>{label} {semana && semana} </div>}
      {inicioEfimDaSemana && (<div className={classes.label}>{inicioEfimDaSemana.inicio.toLocaleDateString('pt-BR', {day: "2-digit",  month: '2-digit'}) + ' até ' +inicioEfimDaSemana.fim.toLocaleDateString('pt-BR', {day: "2-digit",  month: '2-digit'})} </div> )
      }
    </div>
  );
};

GaugeMeter.propTypes = {
  formatter: PropTypes.func,
};

export default GaugeMeter;

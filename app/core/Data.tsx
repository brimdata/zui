import styled from "styled-components"

export const Data = styled.dl`
  ${(p) => p.theme.typography.labelSmall}
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
  padding: 0 12px;
  height: 24px;
  cursor: default;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 12px;
    right: 0;
    height: 1px;
    box-shadow: 0 0.5px 0 var(--cloudy);
  }

  &:last-of-type:after {
    display: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  &:first-of-type:last-of-type:hover {
    background: none;
  }
`

export const Name = styled.dt`
  margin: 0;
  margin-right: auto;
  white-space: nowrap;
`

export const Value = styled.dd`
  margin: 0 0 0 8px;
  color: var(--slate);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.addr,
  &.set\[addr\] {
    color: var(--ip);
  }

  &.port,
  &.set\[port\] {
    color: var(--port);
  }

  &.interval,
  &.set\[interval\] {
    color: var(--interval);
  }

  &.count,
  &.set\[count\] {
    color: var(--count);
  }

  &.bool,
  &.set\[bool\] {
    color: var(--blue);
  }
`

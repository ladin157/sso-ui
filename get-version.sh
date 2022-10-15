#!/bin/bash -e

mvn --file=./sso-theme/pom.xml help:evaluate -Dexpression=project.version -q -DforceStdout